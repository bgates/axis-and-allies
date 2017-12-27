import {
  combineUnits,
  unitWithOrigin,
  landingSlots
} from '../../selectors/units'
import {
  isFriendly,
  isLand, 
  isSea
} from '../../selectors/getTerritory'
import unitTypes from '../../config/unitTypes'

const nonNeutral = ({ currentPower }) => currentPower !== 'Neutrals'
   
const canalOpenIfPresent = ({ canalToIndex, canalControlIndex }, currentPower, board, { index }) => {
  return !canalToIndex || 
    canalToIndex !== index ||
    isFriendly(board[canalControlIndex], currentPower)
}

const passableBySeaUnit = (territory, currentPower, board, lastTerritory, allUnits) => {
  return territory.sea && isFriendly(territory, currentPower, allUnits) && 
    canalOpenIfPresent(territory, currentPower, board, lastTerritory)
}

export const territoriesInRange = (board, currentPower, territory, accessible, maxRange, allUnits) => {
  let territories = { 0: [territory] }
  let territoryList = [territory.name]
  for (let range = 1; range <= maxRange; range ++) {
    territories[range] = territories[range - 1].reduce((all, last) => {
      const newAdjacents = last.adjacentIndexes.reduce((adjacents, i) => {
        const current = board[i]
        if (territoryList.includes(current.name) || !accessible(current, currentPower, board, last, allUnits)) {
          return adjacents
        } else {
          territoryList.push(current.name)
          return adjacents.concat(current)
        }
      }, [])
      return all.concat(newAdjacents)
    }, [])
  }
  return territories
}

const availableUnit = (range, currentPower, medium, returnFlight = 0) => unit => {
  const { movement } = unitTypes[unit.type]
  const effectiveRange = medium === 'air' ? movement - returnFlight : movement
  return unitTypes[unit.type][medium] && 
    unit.power === currentPower && 
    effectiveRange >= range
}

const unitsWithOrigin = (range, currentPower, medium, returnFlight) => (units, territory) => {
  const territoryUnits = territory.units.filter(availableUnit(range, currentPower, medium, returnFlight))
  return [...units, ...territoryUnits.map(unitWithOrigin(territory, range))]
}

const unitsAtRange = (territories, currentPower, medium, returnFlight) => (total, range) => {
  const units = territories[range]
    .reduce(unitsWithOrigin(range, currentPower, medium, returnFlight), [])
  return [...total, ...units]
}

const unitsInRange = (territories, currentPower, medium, returnFlight) => (
  Object.keys(territories)
    .reduce(unitsAtRange(territories, currentPower, medium, returnFlight), [])
)

const friendlyLand = (territory, currentPower) => isLand(territory) && isFriendly(territory, currentPower)

const hasLandingSlots = ({ units }, currentPower) => (
  units.reduce((total, unit) => (
    total + (unit.power === currentPower && landingSlots(unit)) ? 1 : 0
  ), 0)
)

export const canLandInTerritory = (territory, currentPower) => (  
  friendlyLand(territory, currentPower) || hasLandingSlots(territory, currentPower)
)

const landable = currentPower => territory => canLandInTerritory(territory, currentPower)

const airUnitsInRange = (board, currentPower, territory, destination, allUnits) => {
  if (territory.units.length) { 
    const territories = territoriesInRange(board, currentPower, territory, nonNeutral, 6)
    const returnFlight = Object.keys(territories).reduce((min, range) => (
      territories[range].some(landable(currentPower)) ? Math.min(min, range) : min
    ), 8)
    return unitsInRange(territories, currentPower, 'air', returnFlight)
  } else if (destination[territory.index] && destination[territory.index].some(id => landingSlots(allUnits[id]))){
    const territories = territoriesInRange(board, currentPower, territory, nonNeutral, 4)
    return unitsInRange(territories, currentPower, 'navalRated')
  }
}

const landUnitsInRange = (board, currentPower, territory) => {
  let territories = territoriesInRange(board, currentPower, territory, friendlyLand, 2)
  return unitsInRange(territories, currentPower, 'land')
}

const transportOrMovedTo = (territory) => ( 
  unit => unit.originIndex !== territory.index || unit.transport
)

const amphibUnitsInRange = (board, currentPower, _territory, inbound, destination, { transporting }, { transport }, allUnits) => {
  const territories = _territory.adjacentIndexes.map(index => board[index]).filter(isSea)
  return territories.reduce((transports, territory) => {
    const territoryTransports = territory.units
      .filter(unit => transporting[unit.id] && !inbound[unit.id])
      .concat(
        (destination[territory.index] || [])
        .filter(id => transporting[id])
        .map(id => allUnits[id]))  
      .filter(({ power, id }) => (
        power === currentPower && 
        (!transport[id] || transport[id] === _territory.index)
      ))
    return [...transports, ...territoryTransports.map(unit => ({ ...unit, originName: territory.name, originIndex: territory.index }))]
  }, [])
}

const seaUnitsInRange = (board, currentPower, territory, allUnits) => {
  let territories = territoriesInRange(board, currentPower, territory, passableBySeaUnit, 2, allUnits)
  let units = unitsInRange(territories, currentPower, 'ship')
  return units.filter(transportOrMovedTo(territory))
}

const unitSort = (a, b) => {
  if (a.distance > b.distance) {
    return 1
  } else if (b.distance > a.distance) {
    return -1
  } else if (a.originName !== b.originName) {
    return a.originName.localeCompare(b.originName)
  } else {
    return a.attack > b.attack ? 1 : -1
  }
}

const unitsByMedium = (board, currentPower, territory, inbound, destination, transport, amphib, allUnits) => {
  if (isLand(territory)) {
    return [
      ...landUnitsInRange(board, currentPower, territory),
      ...amphibUnitsInRange(board, currentPower, territory, inbound, destination, transport, amphib, allUnits),
      ...airUnitsInRange(board, currentPower, territory)
    ]
    //} else if (isFriendly(territory, currentPower, allUnits)) {
    //return seaUnitsInRange(board, currentPower, territory, allUnits)
  } else {
    return [
      ...seaUnitsInRange(board, currentPower, territory, allUnits),
      ...airUnitsInRange(board, currentPower, territory, destination, allUnits)
    ]
  }
}

export const combatUnitsInRange = (board, currentPower, territory, inbound, destination, transport, amphib, allUnits) => {
  const uncommitted = unit => !inbound[unit.id] || 
    inbound[unit.id] === territory.index || 
    transport.transporting[unit.id]
  return unitsByMedium(board, currentPower.name, territory, inbound, destination, transport, amphib, allUnits)      
    .filter(uncommitted)
    .reduce(combineUnits, [])
    .sort(unitSort)
}


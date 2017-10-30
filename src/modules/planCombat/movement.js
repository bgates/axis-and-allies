import { 
  isFriendly, 
  allUnits
} from '../../lib/territory'
import {
  combineUnits
} from '../../selectors/units'
import {
  isLand, 
  isSea
} from '../../selectors/getTerritory'
import unitTypes from '../../config/unitTypes'

const nonNeutral = ({ currentPower }) => currentPower !== "Neutrals"
   
const passableByLandUnit = (territory, currentPower) => {
  return isLand(territory) && isFriendly(territory, currentPower)
}

const canalOpenIfPresent = ({ canalToIndex, canalControlIndex }, currentPower, board, { index }) => {
  return !canalToIndex || 
    canalToIndex !== index ||
    isFriendly(board[canalControlIndex], currentPower)
}

const passableBySeaUnit = (territory, currentPower, board, lastTerritory) => {
  return territory.sea && isFriendly(territory, currentPower) && 
    canalOpenIfPresent(territory, currentPower, board, lastTerritory)
}

export const territoriesInRange = (board, currentPower, territory, accessible, maxRange) => {
  let territories = { 0: [territory] }
  let territoryList = [territory]
  for (let range = 1; range <= maxRange; range ++) {
    territories[range] = territories[range - 1].reduce((all, last) => {
      const newAdjacents = last.adjacentIndexes.reduce((adjacents, i) => {
        const current = board[i]
        if (territoryList.includes(current) || !accessible(current, currentPower, board, last)) {
          return adjacents
        } else {
          territoryList.push(current)
          return adjacents.concat(current)
        }
      }, [])
      return all.concat(newAdjacents)
    }, [])
  }
  return territories
}

const availableUnit = (range, currentPower, medium, returnFlight) => unit => {
  const { movement } = unitTypes[unit.type]
  const effectiveRange = medium === 'air' ? movement - returnFlight : movement
  return unitTypes[unit.type][medium] && 
    unit.power === currentPower && 
    effectiveRange >= range
}

const unitWithOrigin = ({ name, index }, range) => unit => (
  { 
    ...unit, 
    originName: name, 
    originIndex: index, 
    distance: parseInt(range, 10) 
  } 
)

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
    total + (unit.power === currentPower.name && unitTypes[unit.type].landingSlots) ? 1 : 0
  ), 0)
)

export const canLandInTerritory = (territory, currentPower) => (  
  friendlyLand(territory, currentPower) || hasLandingSlots(territory, currentPower)
)

const landable = currentPower => territory => canLandInTerritory(territory, currentPower)

const airUnitsInRange = (board, currentPower, territory) => {
  if (territory.units.length) { //TODO: this condition is too narrow-can't noncom to carrier or empty
    const territories = territoriesInRange(board, currentPower, territory, nonNeutral, 6)
    const returnFlight = Object.keys(territories).reduce((min, range) => (
      territories[range].some(landable(currentPower)) ? Math.min(min, range) : min
    ), 8)
    return unitsInRange(territories, currentPower.name, 'air', returnFlight)
  } else {
    return []
  }
}

const landUnitsInRange = (board, currentPower, territory) => {
  let territories = territoriesInRange(board, currentPower, territory, passableByLandUnit, 2)
  return unitsInRange(territories, currentPower.name, 'land');
}

const transportOrMovedTo = (territory) => ( 
  unit => unit.originIndex !== territory.index || unit.transport
)

const amphibUnitsInRange = (board, currentPower, territory) => {
  const territories = territory.adjacentIndexes.map(index => board[index]).filter(isSea)
  const activeTransports = territories.reduce((transports, territory) => {
    const potentialUnits = allUnits(territory)
    const territoryTransports = potentialUnits.filter(unit => {
      return unit.cargo && unit.power === currentPower.name
    })
    return [...transports, ...territoryTransports.map(unit => ({ ...unit, originName: territory.name, originIndex: territory.index }))]
  }, [])
  return activeTransports
}

const seaUnitsInRange = (board, currentPower, territory) => {
  let territories = territoriesInRange(board, currentPower, territory, passableBySeaUnit, 2)
  let units = unitsInRange(territories, currentPower.name, 'ship')
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

const unitsByMedium = (board, currentPower, territory) => {
  if (isLand(territory)) {
    return [
      ...landUnitsInRange(board, currentPower, territory),
      ...amphibUnitsInRange(board, currentPower, territory),
      ...airUnitsInRange(board, currentPower, territory)
    ]
  } else if (isFriendly(territory, currentPower)) {
    return seaUnitsInRange(board, currentPower, territory)
  } else {
    return [
      ...seaUnitsInRange(board, currentPower, territory),
      ...airUnitsInRange(board, currentPower, territory)
    ]
  }
}

export const combatUnitsInRange = (board, currentPower, territory, committed) => {
  const uncommitted = unit => !committed.includes(unit.id)
  return unitsByMedium(board, currentPower, territory)      
    .filter(uncommitted)
    .reduce(combineUnits, [])
    .sort(unitSort)
}


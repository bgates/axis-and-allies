import { createSelector } from 'reselect'
import { getCurrentPower, getCurrentPowerName } from '../../selectors/getCurrentPower'
import { 
  isLand,
  getFocusTerritory, 
  getInboundUnits,
  getCommittedIds,
  getCommittedUnits,
  getMovedUnitIds,
  mergeBoardAndTerritories,
  hasIndustrialComplex as hasIndustry
} from '../../selectors/getTerritory'
import { 
  air,
  getAllUnits, 
  getAllInbound, 
  landingSlots,
  movement,
  combineUnits,
  nonIndustry
} from '../../selectors/units'
  
import { combatUnitsInRange } from './movement'
import { allyOf, enemyOf } from '../../config/initialPowers'
export { getCurrentPower, getFocusTerritory, getCommittedIds }

export const getTransport = state => state.transport
const getAmphib = state => state.amphib

export const unitsInRange = createSelector(
  mergeBoardAndTerritories,
  getCurrentPower,
  getFocusTerritory,
  getAllInbound,
  getMovedUnitIds,
  getTransport,
  getAmphib,
  getAllUnits,
  combatUnitsInRange
)

const placeCargoOnTransports = (transports, amphib = {}, territory = {}) => (units, unit, _, allUnits) => {
  const { transporting, transportedBy } = transports
  if (transportedBy[unit.id] && (territory.sea || !amphib.transport[transportedBy[unit.id]])) {
    return units
  } else if (transporting[unit.id]) {
    const cargo = transporting[unit.id].map(id => allUnits.find(u => u.id === id))
    return [ ...units, { ...unit, cargo } ]
  } else {
    return units.concat(unit)
  }
}

const amphibious = ({ index }, { territory }, { transporting }, allUnits) => (
  (territory[index] || [])
  .map(transportId => transporting[transportId])
  .reduce((all, ids) => all.concat(ids.map(id => allUnits[id])), [])
)

const uncombinedCombatants = (currentPower, territory, committedUnits, transport, allUnits, amphib) => {
  const combatUnits = territory.units.filter(nonIndustry)
  let attackers = combatUnits
    .filter(allyOf(currentPower))
    .concat(committedUnits)
    .concat(amphibious(territory, amphib, transport, allUnits))
    .reduce(placeCargoOnTransports(transport, amphib, territory), [])
  let defenders = combatUnits
    .filter(enemyOf(currentPower))
    .reduce(placeCargoOnTransports(transport), [])
  return { attackers, defenders }
}

export const strategicBombing = createSelector(
  getFocusTerritory,
  state => state.strategicBombing,
  ({ index }, bombers) => (bombers.targetTerritories[index] || [])//.filter(id => unitIds.includes(id))
)

export const combatants = createSelector(
  getCurrentPowerName,
  getFocusTerritory,
  getCommittedUnits,
  getTransport,
  getAllUnits,
  state => state.amphib,
  uncombinedCombatants
)

export const combinedCombatants = createSelector(
  state => state.strategicBombing,
  combatants,
  ({ bombingUnits }, { attackers, defenders }) => {
    const strategicBombers = attackers.filter(({ id }) => bombingUnits[id]).reduce(combineUnits, [])
    attackers = attackers.filter(({ id }) => !bombingUnits[id]).reduce(combineUnits, []).concat(strategicBombers)
    defenders = defenders.reduce(combineUnits, [])
      /*if (territory && territory.dogfight) {
      defenders = defenders.filter(u => u.air && !u.name.includes('strategic'))
      attackers = attackers.filter(u => u.air)
    }*/
    return { attackers, defenders }
  }
)

export const getFlights = state => state.flightDistance

export const territoryLandingSlots = createSelector(
  getCurrentPower,
  getFocusTerritory,
  getInboundUnits,
  getAllUnits,
  getFlights,
  (currentPower, territory, inbound, units, flights) => {
    if (isLand(territory)) {
      return 1000
    }
    //TODO: this isn't right.
    const requiredLandingSlots = territory.unitIds.concat(inbound)
      .map(id => units[id])
      .filter(air)
      .filter(unit => unit.power === currentPower.name)
      .filter(unit => flights[unit.id] && flights[unit.id] < movement(unit)).length
    // find all units present+(inbound and w flightdistance===max range)
    //const requiredLandingSlots = territory.units.filter(unit => unit.air && unit.distance === unit.movement)
    if (!requiredLandingSlots) {
      return 1000
    }
    const totalLandingSlots = territory.unitIds.concat(inbound)
      .map(id => units[id])
      .filter(unit => landingSlots(unit) && unit.power === currentPower.name)
      .reduce((total, unit) => total + landingSlots(unit), 0)
    return totalLandingSlots - requiredLandingSlots
  }
)

export const hasIndustrialComplex = createSelector(
  state => state,
  getFocusTerritory,
  (state, territory) => hasIndustry(state, territory.index)
)


import { createSelector } from 'reselect'
import { getCurrentPower, getCurrentPowerName } from '../../selectors/getCurrentPower'
import { 
  getFocusTerritory, 
  getCommittedIds,
  getCommittedUnits,
  getMovedUnitIds,
  mergeBoardAndTerritories,
  hasIndustrialComplex as hasIndustry
} from '../../selectors/getTerritory'
import { getAllUnits, getAllInbound, combineUnits } from '../../selectors/units'
  
import { combatUnitsInRange } from './movement'
import { allyOf, enemyOf } from '../../config/initialPowers'
import { nonIndustry, unitCount, totalCount } from '../../lib/unit'
import { allUnits, isLand } from '../../lib/territory'
export { getCurrentPower, getFocusTerritory, getCommittedIds }

const getTransport = state => state.transport

export const unitsInRange = createSelector(
  mergeBoardAndTerritories,
  getCurrentPower,
  getFocusTerritory,
  getAllInbound,
  getMovedUnitIds,
  getTransport,
  getAllUnits,
  combatUnitsInRange
)

const placeCargoOnTransports = (transports, amphib) => (units, unit, _, allUnits) => {
  const { transporting, transportedBy } = transports
  if (transportedBy[unit.id] && !amphib.transport[transportedBy[unit.id]]) {
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
    .reduce(placeCargoOnTransports(transport, amphib), [])
  let defenders = combatUnits
    .filter(enemyOf(currentPower))
    .reduce(placeCargoOnTransports(transport), [])
  return { attackers, defenders }
}

export const combinedCombatants = state => {
  let { attackers, defenders } = combatants(state)
  attackers = attackers.reduce(combineUnits, [])
  defenders = defenders.reduce(combineUnits, [])
    /*if (territory && territory.dogfight) {
    defenders = defenders.filter(u => u.air && !u.name.includes('strategic'))
    attackers = attackers.filter(u => u.air)
  }*/
  return { attackers, defenders }
}

export const combatants = createSelector(
  getCurrentPowerName,
  getFocusTerritory,
  getCommittedUnits,
  getTransport,
  getAllUnits,
  state => state.amphib,
  uncombinedCombatants
)

export const landingSlots = createSelector(
  getCurrentPower,
  getFocusTerritory,
  (currentPower, territory) => {
    if (isLand(territory)) {
      return 1000
    }
    const requiredLandingSlots = territory.units.filter(unit => unit.air && unit.distance === unit.movement)
      .reduce(totalCount, 0)
    if (!requiredLandingSlots) {
      return 1000
    }
    const totalLandingSlots = allUnits(territory).filter(unit => unit.power === currentPower.name && unit.landingSlots)
      .reduce((total, unit) => total + unitCount(unit) * unit.landingSlots, 0)
    return totalLandingSlots - requiredLandingSlots
  }
)

export const hasIndustrialComplex = createSelector(
  state => state,
  getFocusTerritory,
  (state, territory) => hasIndustry(state, territory.index)
)

export const strategicBombing = createSelector(
  getFocusTerritory,
  state => state.strategicBombing,
  (state, unitIds) => unitIds,
  ({ index }, bombers, unitIds) => (bombers.targetTerritories[index] || []).filter(id => unitIds.includes(id))
)

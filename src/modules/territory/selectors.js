import { createSelector } from 'reselect'
import classNames from 'classnames'
import { 
  getAmphib, 
  getBombedTerritories,
  getCompletedMissions, 
  getCurrentPhase, 
  getDestinations,
  getFlights, 
  getLandingPlanes
} from '../../selectors/stateSlices'
import { getCurrentPowerName } from '../../selectors/getCurrentPower'
import { 
  amphibOrigins,
  getTerritory, 
  getTerritoryData, 
  getUnits,
  isFriendly
} from '../../selectors/getTerritory'
import { air, canBombard, getAllUnits, nonIndustry } from '../../selectors/units'
import { allyOf, enemyOf } from '../../config/initialPowers'
import { RESOLVE_COMBAT, ORDER_UNITS, LAND_PLANES, PLAN_MOVEMENT } from '../../actions'

export const getFill = createSelector(
  getTerritory,
  getTerritoryData,
  ({ currentPower }, { sea, original_power }) => {
    if (sea && original_power !== 'Oceans') {
      if (original_power === currentPower){
        return `url(#${original_power.toLowerCase()}_convoy)`
      } else {
        return `url(#${original_power.toLowerCase()}_distress_convoy)`
      }
    } else {
      return 'none'
    }
  }
)

const snakeCase = name => name.toLowerCase().replace(/\s/,'_')

export const getTerritoryId = createSelector(
  getTerritoryData,
  ({ adjacentIndexes, name }) => adjacentIndexes ? null : snakeCase(name)
)
      
export const getTerritoryDimensions = createSelector(
  getTerritoryData,
  ({ dimensions }) => dimensions
)

const isConvoy = (sea, territoryPower) => (
  sea && territoryPower !== 'Oceans'
)

export const isOrdering = (phase, currentPowerName, territoryPower, units) => (
  phase === ORDER_UNITS && 
  ((currentPowerName === territoryPower && 
    units.filter(nonIndustry).length > 1) || 
  (territoryPower === 'Oceans' && units &&
    units.filter(u => u.power === currentPowerName).length > 1
  ))
)

const isActive = (phase, hasAttackers, movedIds, flightDistance, landings) => {
  const hasPlanes = movedIds.some(id => flightDistance[id])
  const hasMovedUnits = movedIds.some(id => !landings[id])
  switch (phase) {
    case (RESOLVE_COMBAT): return false
    case (LAND_PLANES): return hasPlanes
    case (PLAN_MOVEMENT): return hasMovedUnits
    default: return hasAttackers
  }
}

export const getClasses = createSelector(
  getCurrentPowerName,
  getTerritory,
  getTerritoryData,
  getCurrentPhase,
  getAmphib,
  getDestinations,
  getFlights,
  getLandingPlanes,
  (state, index) => index,
  (currentPower, territory, { sea, original_power }, phase, amphib, unitDestination, flightDistance, landings, territoryIndex) => {
    const territoryPower = territory.currentPower || ''
    const isOcean = sea && territoryPower === 'Oceans' 
    const isControlled = !sea && territoryPower.length
    const movedIds = unitDestination[territoryIndex] || []
    const hasAttackers = movedIds.length || 
      (amphib.territory[territoryIndex] || []).length
    const hasCombat = hasAttackers && territory.unitIds.length
    return classNames({
      convoy: isConvoy(sea, territoryPower),
      winter: !sea && original_power === 'USSR',
      [territoryPower.toLowerCase()]: isOcean || isControlled,
      active: isActive(phase, hasAttackers, movedIds, flightDistance, landings),
      'active-combat': phase === RESOLVE_COMBAT && hasCombat && territoryPower !== currentPower,
      //'active-order-units': isOrdering(phase, currentPower, territoryPower, units)
    })
  }
)

const lostChineseTerritories = ['Hong Kong', 'Shantung', 'Shansi', 'Peking', 'Chahar', 'Northern Manchuria', 'Manchuria', 'Korea', 'Burma']

const isChina = (name, original_power) => (
  original_power === 'China' || 
  lostChineseTerritories.includes(name)
)

export const isAttackable = createSelector(
  getCurrentPowerName,
  getTerritoryData,
  getTerritory,
  getAllUnits,
  (currentPower, { original_power, sea, name }, territory, units) => {
    const unfriendly = !isFriendly(territory, currentPower, units) 
    if (currentPower === 'China') {
      return isChina(name, original_power) && unfriendly
    } else {
      return sea || unfriendly
    }
  }
)

const isAmphib = (state, territoryIndex) => (state.amphib.territory[territoryIndex] || []).length

export const isCombat = createSelector(
  getCurrentPowerName,
  getUnits,
  isAmphib,
  getCompletedMissions,
  (currentPower, units, amphib, missionComplete) => (
    (units.filter(({ id }) => !missionComplete[id]).some(allyOf(currentPower)) && units.some(enemyOf(currentPower))) || amphib
  )
)

export const awaitingNavalResolution = (state, territoryIndex) => {
  const { amphib, inboundUnits } = state
  return amphibOrigins(amphib, inboundUnits, territoryIndex).some(index => isCombat(state, index))
}

const getAirUnits = createSelector(
  getUnits,
  units => units.filter(air)
)

export const isDogfightable = createSelector(
  getCurrentPowerName,
  getAirUnits,
  (currentPower, units) => units.some(allyOf(currentPower)) && units.some(enemyOf(currentPower))
)

export const isBombed = createSelector(
  getBombedTerritories,
  (state, territoryIndex) => territoryIndex,
  (territories, territoryIndex) => (territories[territoryIndex] || []).length
)

export const isBombardable = (state, territoryIndex) => {
  const { amphib, inboundUnits } = state
  return amphibOrigins(amphib, inboundUnits, territoryIndex)
    .map(index => getUnits(state, index))
    .some(units => units.some(canBombard))
}

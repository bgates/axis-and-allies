// @flow
import { createSelector } from 'reselect'
import classNames from 'classnames'
import { 
  getAmphib, 
  getCompletedMissions, 
  getCurrentPhase, 
  getDestinations,
  getFlights, 
  getLandingPlanes,
} from '../../../selectors/stateSlices'
import { getCurrentPowerName } from '../../../selectors/getCurrentPower'
import { 
  getTerritory, 
  getTerritoryData, 
  getUnits,
  isFriendly
} from '../../../selectors/getTerritory'
import { getAllUnits, nonIndustry } from '../../../selectors/units'
import { allyOf, enemyOf } from '../../../config/initialPowers'
import { RESOLVE_COMBAT, ORDER_UNITS, LAND_PLANES, PLAN_MOVEMENT } from '../../../actions'
import type { PowerName } from '../../../actions/types'
import type { UnitType } from '../../../selectors/units'
import type { Amphib } from '../../../selectors/getTerritory'

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

export const isOrdering = (phase: string, currentPowerName: PowerName, territoryPower: string, units: Array<UnitType>) => (
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
  getCompletedMissions,
  (state, index) => index,
  (currentPower, territory, { sea, original_power }, phase, amphib, unitDestination, flightDistance, landings, completedMissions, territoryIndex) => {
    const territoryPower = territory.currentPower || ''
    const isOcean = sea && territoryPower === 'Oceans' 
    const isControlled = !sea && territoryPower.length
    const movedIds = (unitDestination[territoryIndex] || [])
    const hasAttackers = movedIds.filter(id => !completedMissions[id]).length || 
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



import { createSelector } from 'reselect'
import classNames from 'classnames'
import { getCurrentPower } from '../../selectors/getCurrentPower'
import { getTerritory, getTerritoryData } from '../../selectors/getTerritory'
import { nonIndustry, airComplete } from '../../lib/unit'
import { RESOLVE_COMBAT, ORDER_UNITS, LAND_PLANES } from '../../actions'

export const getFill = createSelector(
  getTerritory,
  getTerritoryData,
  ({ currentPower }, { sea, original_power }) => {
    if (sea && original_power !== 'Oceans') {
      if (original_power === currentPower){
        return `url(#${original_power.toLowerCase()}_convoy)`
      } else {
        return 'none' //TODO: Needs to be convoy in distress image
      }
    } else {
      return 'none'
    }
  }
)

const isConvoy = (sea, territoryPower) => (
  sea && territoryPower !== 'Oceans'
)

const hasAirComplete = (units = []) => (
  units.filter(airComplete).length
)

export const isOrdering = (phase, currentPowerName, territoryPower, units) => (
  phase === ORDER_UNITS && 
  ((currentPowerName === territoryPower && 
    units.filter(nonIndustry).length > 1) || 
  (territoryPower === 'Oceans' && units &&
    units.filter(u => u.power === currentPowerName)
         .filter(nonIndustry).length > 1
  ))
)

//TODO: active class shouldn't apply to land-planes spaces until that phase
export const getClasses = (state, territory) => {
  const currentPowerName = getCurrentPower(state).name;
  const phase = state.phase.current;
  const { sea, units, unitsFrom } = territory;
  const territoryPower = territory.currentPower || ''
  const isOcean = sea && territoryPower === 'Oceans' 
  const isControlled = !sea && territoryPower.length
  return classNames({
    convoy: isConvoy(sea, territoryPower),
    [territoryPower.toLowerCase()]: isOcean || isControlled,
    active: (hasAirComplete(units) && phase === LAND_PLANES) || (unitsFrom.length && phase !== RESOLVE_COMBAT),
    'active-combat': unitsFrom.length && phase === RESOLVE_COMBAT && territoryPower !== currentPowerName,
    'active-order-units': isOrdering(phase, currentPowerName, territoryPower, units)
  })
}


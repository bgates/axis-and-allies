import classNames from 'classnames';
import { getCurrentPower } from '../../selectors/getCurrentPower';
import { nonIndustry } from '../../lib/unit';

export const getFill = (territory) => {
  const { sea, original_power, currentPower } = territory;
  if (sea && original_power !== 'Oceans') {
    console.log(currentPower, original_power)
    if (original_power === currentPower){
      return `url(#${original_power.toLowerCase()}_convoy)`
    } else {
      return 'none' //TODO: Needs to be convoy in distress image
    }
  } else {
    return 'none'
  }
}

const isConvoy = (sea, territoryPower) => (
  sea && territoryPower !== 'Oceans'
)

const isActive = (newlyConquered, units) => (
  !!newlyConquered && units.filter(u => u.air).length
)

const isOrdering = (phase, currentPowerName, territoryPower, units) => (
  phase === 'order-units' && 
  ((currentPowerName === territoryPower && 
    units.filter(nonIndustry).length > 1) || 
  (territoryPower === 'Oceans' && 
    units.filter(u => u.power === currentPowerName)
         .filter(nonIndustry).length > 1
  ))
)

//TODO: active class shouldn't apply to land-planes spaces until that phase
export const getClasses = (state, territory) => {
  const currentPowerName = getCurrentPower(state).name;
  const phase = state.phase.current;
  const { sea, units, unitsFrom, newlyConquered } = territory;
  const territoryPower = territory.currentPower || ''
  const isOcean = sea && territoryPower === 'Oceans' 
  const isControlled = !sea && territoryPower.length
  return classNames({
    convoy: isConvoy(sea, territoryPower),
    [territoryPower.toLowerCase()]: isOcean || isControlled,
    active: isActive(newlyConquered, units),
    'active-combat': unitsFrom.length,
    'active-order-units': isOrdering(phase, currentPowerName, territoryPower, units)
  })
}


import { createSelector } from 'reselect';
import { getCurrentPower } from '../globalSelectors';
import { territoriesOwnedBy, calculateNPL } from '../income';
export { getCurrentPower }

const nplFor = (power, territories) => {
  return power === 'China' ? territories.length : calculateNPL(territories)
}

const nplAsObject = (powers, territories) => {
  return powers.reduce((object, power) => {
    const powerName = power.name
    object[powerName] = nplFor(powerName, territories[powerName])
    return object
  }, {})
}

export const nplByPower = createSelector(
  state => state.powers,
  territoriesOwnedBy,
  nplAsObject
)


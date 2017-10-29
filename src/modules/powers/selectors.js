import { createSelector } from 'reselect'
import { getCurrentPower, getPowers } from '../../selectors/getCurrentPower'
import { territoriesOwnedBy, calculateNPL } from '../income'
export { getCurrentPower, getPowers }

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
  getPowers,
  territoriesOwnedBy,
  nplAsObject
)


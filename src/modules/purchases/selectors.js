import { createSelector } from 'reselect'
import { getPurchases } from '../../selectors/stateSlices'
import { getCurrentPower } from '../../selectors/getCurrentPower'
import unitTypes from '../../config/unitTypes'
export { getCurrentPower }

export const purchaseCost = createSelector(
  getPurchases,
  purchases => {
    return Object.keys(purchases).reduce((total, unitName) => {
      return total + purchases[unitName] * unitTypes[unitName].cost
    }, 0)
  }
);

const powerCanBuild = (unit, power) => {
  return !unit.name.includes('damaged') && 
    (power.name !== 'Japan' || !['fighter', 'tactical bomber', 'naval fighter', 'naval tactical bomber', 'strategic bomber'].includes(unit.name)) &&
    (power.name !== 'USSR' || !unit.name.includes('naval')) &&
    (power.name !== 'Italy' || !unit.name.includes('naval')) &&
    (!unit.tech || unit.tech.every(tech => power.tech.includes(tech)))
};

export const buildableUnits = createSelector(
  getCurrentPower,
  power => Object.values(unitTypes).filter(unit => powerCanBuild(unit, power))
);



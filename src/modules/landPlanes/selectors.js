import { createSelector } from 'reselect';
import { getCurrentPower } from '../../selectors/getCurrentPower';
import { mergeBoardAndTerritories, getFocusTerritory } from '../../selectors/mergeBoardAndTerritories';
import { territoriesInRange } from '../planCombat';
import { nonNeutral, isLand } from '../../lib/territory';

export const landingOptions = createSelector(
  mergeBoardAndTerritories,
  getCurrentPower,
  getFocusTerritory,
  (board, currentPower, territory) => console.log('cmon man') || landingOptionsByUnit(board, currentPower, territory)
)

const availableForLanding = (currentPower) => (territory) => (
  isLand(territory) && !territory.newlyConquered && territory.currentPower === currentPower.name
)

const landingOptionsByUnit = (board, currentPower, territory) => {
  const airUnits = territory.units.filter(u => u.air);
  let landingOptions = {};
  airUnits.forEach(unit => {
    const range = unit.movement - unit.distance;
    const territories = Object.values(territoriesInRange(board, currentPower, territory, nonNeutral, range)).reduce((all, elm) => [...all, ...elm], [])
    landingOptions[`${unit.name}-${unit.originName}-${range}`] = territories.filter(availableForLanding(currentPower));
  })
  return landingOptions;
}

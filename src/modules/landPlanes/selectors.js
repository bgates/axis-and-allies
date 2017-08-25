import { createSelector } from 'reselect';
import { getCurrentPower } from '../../selectors/getCurrentPower';
import { mergeBoardAndTerritories, getFocusTerritory } from '../../selectors/mergeBoardAndTerritories';
import { territoriesInRange } from '../planCombat';
import { nonNeutral, isLand } from '../../lib/territory';

export const airUnits = createSelector(
  getFocusTerritory,
  territory => territory.units.filter(u => u.air).map(u => ({ ...u, options: `${u.name}-${u.originName}` }))
)

export const landingOptions = createSelector(
  mergeBoardAndTerritories,
  getCurrentPower,
  getFocusTerritory,
  airUnits,
  (board, currentPower, territory, airUnits) => landingOptionsByUnit(board, currentPower, territory, airUnits)
)

const availableForLanding = (currentPower) => (territory) => (
  isLand(territory) && !territory.newlyConquered && territory.currentPower === currentPower.name
)

const landingOptionsByUnit = (board, currentPower, territory, airUnits) => {
  let landingOptions = {};
  airUnits.forEach(unit => {
    const range = unit.movement - unit.distance;
    const territories = Object.values(territoriesInRange(board, currentPower, territory, nonNeutral, range)).reduce((all, elm) => [...all, ...elm], [])
    landingOptions[`${unit.name}-${unit.originName}`] = territories.filter(availableForLanding(currentPower));
  })
  return landingOptions;
}

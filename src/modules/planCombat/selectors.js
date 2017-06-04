import { createSelector } from 'reselect';
import { getCurrentPower } from '../../selectors/getCurrentPower';
import { mergeBoardAndTerritories, getFocusTerritory } from '../../selectors/mergeBoardAndTerritories';
import { combatUnitsInRange } from './movement';
import { sameSide } from '../../config/initialPowers';
import { consolidateUnits, nonIndustry, duplicateUnit } from '../../lib/unit';
export { getCurrentPower, getFocusTerritory }

export const unitsInRange = createSelector(
  mergeBoardAndTerritories,
  getCurrentPower,
  getFocusTerritory,
  combatUnitsInRange
);

const _combatants = (currentPower, territory) => {
  const combatUnits = territory.units.filter(nonIndustry);
  const _attackers = combatUnits.filter(unit => {
    return sameSide(unit.power, currentPower.name);
  }).map(duplicateUnit);
  const defenders = combatUnits.filter(unit => {
    return !sameSide(unit.power, currentPower.name);
  }).map(duplicateUnit);
  let attackers = _attackers.concat(territory.unitsFrom || []);
  attackers = consolidateUnits(attackers);
  return { attackers, defenders }
}

export const combatants = createSelector(
  getCurrentPower,
  getFocusTerritory,
  (currentPower, territory) => _combatants(currentPower, territory)
)


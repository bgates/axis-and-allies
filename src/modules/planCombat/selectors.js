import { createSelector } from 'reselect';
import { getCurrentPower } from '../../selectors/getCurrentPower';
import { mergeBoardAndTerritories, getFocusTerritory } from '../../selectors/mergeBoardAndTerritories';
import { combatUnitsInRange } from './movement';
import { sameSide } from '../../config/initialPowers';
import { consolidateUnits, nonIndustry, duplicateUnit } from '../../lib/unit';
import { allUnits, isLand } from '../../lib/territory';
export { getCurrentPower, getFocusTerritory }

export const unitsInRange = createSelector(
  mergeBoardAndTerritories,
  getCurrentPower,
  getFocusTerritory,
  combatUnitsInRange
);

const amphibFor = ({ amphib }, board) => {
  return Object.keys(amphib).reduce((array, id) => {
    const territory = board[amphib[id]];
    const transport = (allUnits(territory)).find(unit => unit.ids.includes(id));
    return array.concat(transport.cargo[id]);
  }, [])
}

const _combatants = (board, currentPower, territory) => {
  const combatUnits = territory.units.filter(nonIndustry);
  const _attackers = combatUnits.filter(unit => {
    return sameSide(unit.power, currentPower.name);
  }).map(duplicateUnit);
  let defenders = combatUnits.filter(unit => {
    return !sameSide(unit.power, currentPower.name);
  }).map(duplicateUnit);
  let attackers = _attackers.concat(territory.unitsFrom || []);
  if (territory.amphib) {
    attackers = attackers.concat(amphibFor(territory, board))
  }
  attackers = consolidateUnits(attackers);
  if (territory.dogfight) {
    defenders = defenders.filter(u => u.air && !u.name.includes('strategic'))
    attackers = attackers.filter(u => u.air)
  }
  return { attackers, defenders }
}

export const combatants = createSelector(
  mergeBoardAndTerritories,
  getCurrentPower,
  getFocusTerritory,
  (board, currentPower, territory) => _combatants(board, currentPower, territory)
)

export const landingSlots = createSelector(
  getCurrentPower,
  getFocusTerritory,
  (currentPower, territory) => {
    if (isLand(territory)) {
      return 1000
    }
    const requiredLandingSlots = territory.unitsFrom.filter(unit => unit.air && unit.distance === unit.movement)
      .reduce((total, unit) => total + unit.ids.length, 0)
    if (!requiredLandingSlots) {
      return 1000
    }
    const totalLandingSlots = allUnits(territory).filter(unit => unit.power === currentPower.name && unit.landingSlots)
      .reduce((total, unit) => total + unit.ids.length * unit.landingSlots, 0)
    return totalLandingSlots - requiredLandingSlots
  }
)

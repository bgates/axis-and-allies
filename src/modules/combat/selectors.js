import { createSelector } from 'reselect';
import { combatants } from '../planCombat'

const _strengths = (combatants) => {
  const { attackers, defenders } = combatants;
  const dieMax = Math.max(...attackers.map(u => u.attack), 
    ...defenders.map(u => u.defend));
  return Array(dieMax).fill().map((n, i) => i + 1);
}

export const strengths = createSelector(
  combatants,
  combatants => _strengths(combatants)
);

export const rollCount = createSelector(
  combatants,
  combatants => (combatants.attackers.concat(combatants.defenders)).reduce((total, unit) => total + unit.ids.length, 0)
)

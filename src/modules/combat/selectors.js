import { createSelector } from 'reselect';
import { combatants } from '../planCombat'

const _rolls = (combatants) => {
  const { attackers, defenders } = combatants;
  const dieMax = Math.max(...attackers.map(u => u.attack), 
    ...defenders.map(u => u.defend));
  return Array(dieMax).fill().map((n, i) => i + 1);
}

export const rolls = createSelector(
  combatants,
  combatants => _rolls(combatants)
);

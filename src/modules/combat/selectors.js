import { createSelector } from 'reselect';
import { combatants } from '../planCombat';
import { unitCount } from '../../lib/unit';

export const rollCount = createSelector(
  combatants,
  combatants => (combatants.attackers.concat(combatants.defenders)).reduce(unitCount, 0)
)


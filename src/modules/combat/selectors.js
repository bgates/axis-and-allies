import { createSelector } from 'reselect';
import { combatants } from '../planCombat';
import { getFocusTerritory } from '../../selectors/mergeBoardAndTerritories';
import { unitCount } from '../../lib/unit';
export { getFocusTerritory }

export const rollCount = createSelector(
  combatants,
  combatants => (combatants.attackers.concat(combatants.defenders)).reduce(unitCount, 0)
)


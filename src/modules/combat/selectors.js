import { createSelector } from 'reselect';
import { combatants as combatantsWithoutDamage } from '../planCombat';
import { getFocusTerritory } from '../../selectors/mergeBoardAndTerritories';
import { unitCount, survivors } from '../../lib/unit';
export { getFocusTerritory }

export const rollCount = createSelector(
  combatantsWithoutDamage,
  combatants => (combatants.attackers.concat(combatants.defenders)).reduce(unitCount, 0)
)

export const attackerCasualties = createSelector(
  getFocusTerritory,
  territory => territory.attackerCasualties || []
)

export const combatants = createSelector(
  combatantsWithoutDamage,
  attackerCasualties,
  (combatants, attackerCasualties) => {
    let { attackers, defenders } = combatants 
    return { attackers: survivors(attackers, attackerCasualties), defenders }
  }
)

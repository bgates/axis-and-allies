import { createSelector } from 'reselect';
import { combatants as combatantsWithoutDamage } from '../planCombat';
import { bombardingUnits } from '../combatRolls';
import { getFocusTerritory } from '../../selectors/mergeBoardAndTerritories';
import { totalCount, survivors } from '../../lib/unit';
export { getFocusTerritory }

export const rollCount = createSelector(
  combatantsWithoutDamage,
  combatants => (combatants.attackers.concat(combatants.defenders)).reduce(totalCount, 0)
)

export const attackerCasualties = createSelector(
  getFocusTerritory,
  territory => territory.attackerCasualties || []
)

export const combatants = createSelector(
  combatantsWithoutDamage,
  attackerCasualties,
  bombardingUnits,
  (combatants, attackerCasualties, bombardingUnits) => {
    let { attackers, defenders } = combatants 
    return { attackers: survivors(attackers, attackerCasualties), defenders, bombardingUnits }
  }
)

const noAmphibiousUnits = (territory, attackers) => {
  const ids = Object.keys(territory.amphib)
  return !ids.some(id => attackers.find(attacker => attacker.ids.includes(id)))
}

export const allowRetreat = createSelector(
  getFocusTerritory,
  combatants,
  (territory, { attackers }) => territory.continueCombat && (!territory.amphib || noAmphibiousUnits(territory, attackers))
)

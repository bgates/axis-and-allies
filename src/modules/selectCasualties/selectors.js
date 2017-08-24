import { createSelector } from 'reselect';
import { combatants } from '../planCombat';
import { defenderCasualties, attackerCasualtyCount } from '../combatRolls'
import { getFocusTerritory } from '../../selectors/mergeBoardAndTerritories';
import { unitCount } from '../../lib/unit';
export { getFocusTerritory }

export const rollCount = createSelector(
  combatants,
  combatants => (combatants.attackers.concat(combatants.defenders)).reduce(unitCount, 0)
)

export const attackerCasualties = createSelector(
  getFocusTerritory,
  territory => territory.attackerCasualties || []
)

export const attackDefeated = createSelector(
  combatants,
  attackerCasualtyCount,
  (combatants, casualtyCount) => noneLeft(combatants.attackers, casualtyCount)
)

const noneLeft = (side, casualtyCount) => side.reduce((total, unit) => total + unit.ids.length, 0) <= casualtyCount

const defendersDefeated = createSelector(
  combatants,
  defenderCasualties,
  (combatants, defenderCasualties) => noneLeft(combatants.defenders, defenderCasualties.length)
)

export const victor = createSelector(
  attackDefeated,
  defendersDefeated,
  (attackDefeated, defendersDefeated) => { 
    if (attackDefeated) {
      return 'defender'
    } else if (defendersDefeated) {
      return 'attacker'
    }
  }
)

export const combatOver = state => state.board.filter(t => (t.unitsFrom || []).length && (t.units || []).length).length === 0

export const planesInAir = state => state.board.filter(t => t.unitsFrom.filter(u => u.air).length).length
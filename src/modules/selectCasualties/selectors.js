import { createSelector } from 'reselect';
import { combatants } from '../planCombat';
import { defenderCasualties, attackerCasualtyCount } from '../combatRolls'
import { getFocusTerritory } from '../../selectors/mergeBoardAndTerritories';
import { unitCount } from '../../lib/unit';
import unitTypes from '../../config/unitTypes';
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
  (combatants, casualtyCount) => noneLeft(combatants.attackers, 'attack', casualtyCount)
)

const multiplier = (unit, side) => (
  unitTypes[unit.name].canTakeDamage ? 2 : unit[side] ? 1 : 0
)

const noneLeft = (side, strength, casualtyCount) => (
  side.reduce((total, unit) => total + unit.ids.length * multiplier(unit, strength), 0) <= casualtyCount
)

const defendersDefeated = createSelector(
  combatants,
  defenderCasualties,
  (combatants, defenderCasualties) => noneLeft(combatants.defenders, 'defend', defenderCasualties.length)
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

export const noCombat = state => state.board.territories.filter(t => (t.unitsFrom || []).filter(u => u.mission !== 'complete').length && (t.units || []).length).length === 0

export const isDogfight = createSelector(
  getFocusTerritory,
  territory => territory.dogfight
)

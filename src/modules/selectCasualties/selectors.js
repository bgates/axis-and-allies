import { createSelector } from 'reselect'
import { combatants } from '../planCombat'
import { defenderCasualties, attackerCasualtyCount } from '../combatRolls'
import { getFocusTerritory } from '../../selectors/getTerritory'
import { allUnits } from '../../lib/territory'
import { unitCount, totalCount } from '../../lib/unit'
import unitTypes from '../../config/unitTypes'
export { getFocusTerritory, combatants }

export const rollCount = createSelector(
  combatants,
  combatants => (combatants.attackers.concat(combatants.defenders)).reduce(totalCount, 0)
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
  unitTypes[unit.type].canTakeDamage ? 2 : unitTypes[unit.type][side] ? 1 : 0
)

const noneLeft = (side, strength, casualtyCount) => (
  side.reduce((total, unit) => total + multiplier(unit, strength), 0) <= casualtyCount
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

export const isDogfight = createSelector(
  getFocusTerritory,
  territory => territory.dogfight
)

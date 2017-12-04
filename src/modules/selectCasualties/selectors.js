import { createSelector } from 'reselect'
import { getAttackerCasualties, getDogfights } from '../../selectors/stateSlices'
import { 
  attackerCasualtyCount,
  preCasualtyCombatants as combatants, 
  defenderCasualties, 
} from '../combat'
import { getFocusTerritory } from '../../selectors/getTerritory'
import { land } from '../../selectors/units'
import unitTypes from '../../config/unitTypes'
export { getAttackerCasualties, getFocusTerritory, combatants }

const multiplier = (unit, side) => (
  unitTypes[unit.type].canTakeDamage ? 2 : unitTypes[unit.type][side] ? 1 : 0
)

const noneLeft = (side, strength, casualtyCount) => (
  side.reduce((total, unit) => total + multiplier(unit, strength), 0) <= casualtyCount
)

export const attackDefeated = createSelector(
  combatants,
  attackerCasualtyCount,
  (combatants, casualtyCount) => noneLeft(combatants.attackers, 'attack', casualtyCount)
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
  getDogfights,
  ({ index }, dogfight) => dogfight[index]
)

const idNotIn = array => obj => !array.includes(obj.id)

export const isConquered = createSelector(
  victor,
  combatants,
  getAttackerCasualties,
  (victor, { attackers }, attackerCasualties) => (
    victor === 'attacker' && 
    attackers.filter(idNotIn(attackerCasualties))
      .filter(land).length
  )
)

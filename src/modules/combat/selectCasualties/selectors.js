import { createSelector } from 'reselect'
import { 
  getAllUnits,
  getAttackerCasualties, 
  getCompletedMissions,
  getDogfights, 
  getFlights 
} from '../../selectors/stateSlices'
import { getFocusTerritory } from '../../selectors/getTerritory'
import { air as isAir, land, idsToUnits } from '../../selectors/units'
import { 
  airCasualtyCount,
  attackerCasualtyCount,
  preCasualtyCombatants as combatants, 
  defenderCasualties, 
  strengths,
} from '../combat'
import { noCombat } from '../main/board'
import { planesInAir } from '../postCombat/landPlanes'
import { bombRaid, isBombed, isCombat } from '../main/territory'
import unitTypes from '../../config/unitTypes'
export { 
  defenderCasualties,
  getAttackerCasualties, 
  getCompletedMissions,
  getFlights, 
  getFocusTerritory, 
  combatants,
  strengths,
  planesInAir,
  bombRaid,
  isBombed,
  isCombat,
  noCombat,
}

export const casualtyCount = createSelector(
  airCasualtyCount,
  attackerCasualtyCount,
  (air, all) => ({ air, all })
)

const multiplier = (unit, side) => (
  unitTypes[unit.type].canTakeDamage ? 2 : unitTypes[unit.type][side] ? 1 : 0
)

const noneLeft = (side, strength, casualtyCount) => (
  side.reduce((total, unit) => total + multiplier(unit, strength), 0) <= casualtyCount
)

export const attackDefeated = createSelector(
  combatants,
  getCompletedMissions,
  attackerCasualtyCount,
  (combatants, unitsOutOfCombat, casualtyCount) => {
    const vulnerableUnits = combatants.attackers.filter(unit => !unitsOutOfCombat[unit.id])
    return noneLeft(vulnerableUnits, 'attack', casualtyCount)
  }
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

export const airCasualties = createSelector(
  getAttackerCasualties, 
  getAllUnits,
  (ids, units) => idsToUnits(ids, units).filter(isAir).length
)

export const classNameFct = createSelector(
  getCompletedMissions,
  attackDefeated,
  getAttackerCasualties,
  (unitsOutOfCombat, attackersLost, attackerCasualties) => id => {
    if (unitsOutOfCombat[id]) {
      return null
    }
    return attackersLost || attackerCasualties.includes(id) ? 'casualty' : null
  }
)

export const mayClick = createSelector(
  getCompletedMissions,
  attackDefeated,
  getAttackerCasualties,
  airCasualties,
  casualtyCount,
  (unitsOutOfCombat, attackersLost, attackerCasualties, airCasualties, { air, all }) => (id, type) => {
    if (attackersLost || unitsOutOfCombat[id]) return false
    if (attackerCasualties.includes(id)) return true
    return attackerCasualties.length < all &&
      (isAir({ type }) || 
        airCasualties >= air || 
        attackerCasualties.length < all - air)
  }
)

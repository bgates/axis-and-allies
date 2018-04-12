import { createSelector } from 'reselect'
import { 
  getAmphib, 
  getBombedTerritories,
  getCompletedMissions, 
  getTakenFlak
} from './stateSlices'
import { getCurrentPowerName } from './getCurrentPower'
import { 
  amphibOrigins,
  getUnits,
} from './getTerritory'
import { air, canBombard } from './units'
import { allyOf, enemyOf } from '../config/initialPowers'

const isAmphib = (state, territoryIndex) => (state.amphib.territory[territoryIndex] || []).length

export const isCombat = createSelector(
  getCurrentPowerName,
  getUnits,
  isAmphib,
  getCompletedMissions,
  (currentPower, units, amphib, missionComplete) => (
    (units.filter(({ id }) => !missionComplete[id]).some(allyOf(currentPower)) && units.some(enemyOf(currentPower))) || amphib
  )
)
/*
 * flak
 * strategic dogfight
 * strategic bomb
 * bombard
 * dogfight
 * combat
 * */
/*
 * can get into these only from RESOLVE_COMBAT phase
 * once in, can advance from one to next within a territory
 * or can restart tseq in another territory
 * or if combat phase ends may go to another phase
 * but that's not this selector's responsibility
 * */
  /*
const nextStep = (victor, territoryIndex, dogfight) => {
  if (dogfight) {
    return postDogfight(territoryIndex, victor)
  } else if (victor === 'attacker') {
    return attackerWins(territoryIndex)
  } else if (victor === 'defender') {
    return defenderWins(territoryIndex)
  } else {
    return continueCombat
  }
}

const postDogfight = (territoryIndex, victor) => {
  return (dispatch, getState) => {
    let state = getState()
    if (victor === 'defender') {
      dispatch(loseAttack(territoryIndex, combatants(state).attackers.map(id), defenderCasualties(state)))
    } else if (victor === 'attacker') {
      console.log('skip, see if it matters')
    }
    state = getState()
    if (isBombed(state, territoryIndex)) {
      return bombRaid(dispatch, state, territoryIndex)
    } else if (isCombat(state, territoryIndex)) {
      console.log('combat continues')
      continueCombat(dispatch, getState)
    } else {
      dispatch(push(nextPhase(state)))
    }
  }
}
*/
type AmphibState = {
  amphib:Amphib, 
  inboundUnits:{ [string]:Array<number> }
}
export const awaitingNavalResolution = (state, territoryIndex) => {
  const { amphib, inboundUnits } = state
  return amphibOrigins(amphib, inboundUnits, territoryIndex)
    .some(index => isCombat(state, index))
}

const getAirUnits = createSelector(
  getUnits,
  units => units.filter(air)
)

export const isDogfightable = createSelector(
  getCurrentPowerName,
  getAirUnits,
  (currentPower, units) => units.some(allyOf(currentPower)) && units.some(enemyOf(currentPower))
)

export const isFlakable = createSelector(
  getBombedTerritories,
  getTakenFlak,
  (state, territoryIndex) => territoryIndex,
  (bombTargets, flak, territoryIndex) => bombTargets[territoryIndex] && !flak[territoryIndex]
)

export const isBombed = createSelector(
  getBombedTerritories,
  (state, territoryIndex) => territoryIndex,
  (territories, territoryIndex) => (territories[territoryIndex] || []).length
)

export const isBombardable = (state:AmphibState, territoryIndex:number) => {
  const { amphib, inboundUnits } = state
  return amphibOrigins(amphib, inboundUnits, territoryIndex)
    .map(index => getUnits(state, index))
    .some(units => units.some(canBombard))
}

export const nextCombatSubphase = createSelector(
  isCombat,
  awaitingNavalResolution,
  isFlakable,
  isDogfightable,
  isBombed,
  isBombardable,
  (combat, naval, flak, dogfight, bomb, bombard) => {
    if (combat) {
      if (naval) {
        return 'awaitNaval'
      } else if (flak) {
        return 'flak'
      } else if (dogfight) {
        return 'dogfight'
      } else if (bomb) {
        return 'bombRaid'
      } else if (bombard) {
        return 'bombard'
      } else {
       return 'normal'
      }
    }
  }
)

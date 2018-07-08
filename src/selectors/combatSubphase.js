import { createSelector } from 'reselect'
import { 
  getAmphib, 
  getBombedTerritories,
  getCombatSubphase,
  getCompletedMissions, 
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
  // isbombed?,
  getCompletedMissions,
  (currentPower, units, amphib, missionComplete) => (
    (units.filter(({ id }) => !missionComplete[id]).some(allyOf(currentPower)) && units.some(enemyOf(currentPower))) || amphib
  )
)

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
  getCombatSubphase,
  (state, territoryIndex) => territoryIndex,
  (currentPower, units, combatSubphase, territoryIndex) => combatSubphase[territoryIndex] !== 'dogfight' && units.some(allyOf(currentPower)) && units.some(enemyOf(currentPower))
)

export const isFlakable = createSelector(
  getBombedTerritories,
  getCombatSubphase,
  (state, territoryIndex) => territoryIndex,
  (bombTargets, combatSubphase, territoryIndex) => bombTargets[territoryIndex] && !combatSubphase[territoryIndex]
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

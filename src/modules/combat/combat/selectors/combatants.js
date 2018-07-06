import { createSelector } from 'reselect'
import { combatants as combatantsWithoutDamage } from '../../../planCombat'
import { 
  getAmphib, 
  getAttackerCasualties, 
  getBombedTerritories, 
  getCombatSubphase, 
  getCompletedMissions,
  getCurrentTerritoryIndex,
} from '../../../../selectors/stateSlices'
import { getFocusTerritory } from '../../../../selectors/getTerritory'
import { 
  air,
  idsToUnits, 
  noAA,
  survivors,
  willDogfight,
  withAttack, 
  withDefend,
  withDogfight
} from '../../../../selectors/units'
export { getFocusTerritory, getAttackerCasualties }

export const bombardingUnits = ({ bombardment, missionComplete, phase, units }) => (
  idsToUnits(bombardment.targetTerritories[phase.territoryIndex] || [], units)
  .map(withAttack)
  .filter(({ id }) => !missionComplete[id])
)

const artillery = unit => unit.type === 'artillery'
const infantry = unit => unit.type === 'infantry'

const modify = (units) => {
  const supportable = units.filter(artillery).length
  if (supportable) {
    return [ ...units.filter(infantry).slice(0, supportable).map(u => ({ ...u, attack: 2 })),
      ...units.filter(infantry).slice(supportable).map(withAttack),
      ...units.filter(u => u.type !== 'infantry').map(withAttack)]
  } else {
    return units.map(withAttack)
  }
}

const getDogfightIds = createSelector(
  combatantsWithoutDamage,
  getCurrentTerritoryIndex,
  getCombatSubphase,
  getBombedTerritories,
  getCompletedMissions,
  ({ attackers }, territoryIndex, subphase, strategicBombing, completedMission) => (
    subphase[territoryIndex] === 'dogfight' ? strategicBombing[territoryIndex] || attackers.filter(air).filter(({ id }) => !completedMission[id]) : []
  )
)

const withFlakVsAir = (defenders, attackers) => (
  attackers.some(air) ? defenders : defenders.filter(noAA)
)

export const preCasualtyCombatants = createSelector(
  combatantsWithoutDamage,
  bombardingUnits,
  getDogfightIds,
  getCompletedMissions,
  ({ attackers, defenders }, bombardingUnits, dogfightIds, completedMission) => {
    if (dogfightIds.length > 0) {
      const dogfighters = attackers.filter(({ id }) => dogfightIds.includes(id)).map(withDogfight)
      return {
        attackers: dogfighters,
        defenders: defenders.filter(willDogfight).map(withDefend),
        bombardingUnits: []
      }
    } else {
      const availableAttackers = attackers.filter(({ id }) => !completedMission[id])
      return { 
        attackers: modify(availableAttackers), 
        defenders: withFlakVsAir(defenders, availableAttackers).map(withDefend), 
        bombardingUnits
      }
    }
  }
)

export const combatants = createSelector(
  preCasualtyCombatants,
  getAttackerCasualties,
  ({ attackers, defenders, bombardingUnits }, casualties) => (
    { 
      attackers: survivors(attackers, casualties), 
      defenders, 
      bombardingUnits 
    }
  )
)

export const isUnderway = createSelector(
  getFocusTerritory,
  getCombatSubphase,
  (territory, combatSubphase) => combatSubphase[territory.index]
)

export const allowRetreat = createSelector(
  getFocusTerritory,
  combatants,
  getAttackerCasualties,
  getAmphib,
  getCombatSubphase,
  ({ index }, { attackers }, casualties, amphib, combatSubphase) => (
    !amphib.territory[index] &&
    combatSubphase[index] && 
    attackers.some(({ id }) => !casualties.includes(id))
  )
)


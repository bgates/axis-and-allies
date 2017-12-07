import { createSelector } from 'reselect'
import { combatants as combatantsWithoutDamage } from '../../planCombat'
import { 
  getAmphib, 
  getAttackerCasualties, 
  getBombedTerritories, 
  getCombatUnderway, 
  getCurrentTerritoryIndex,
  getDogfights, 
} from '../../../selectors/stateSlices'
import { getFocusTerritory } from '../../../selectors/getTerritory'
import { 
  air,
  idsToUnits, 
  noAA,
  survivors,
  willDogfight,
  withAttack, 
  withDefend,
  withDogfight
} from '../../../selectors/units'
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

const dogfightIds = createSelector(
  getCurrentTerritoryIndex,
  getDogfights,
  getBombedTerritories,
  (territoryIndex, dogfight, strategicBombing) => (
    dogfight[territoryIndex] && (strategicBombing[territoryIndex] || 'all')
  )
)

const dogfightCombatants = (attackers, defenders, dogfighters) => (
  dogfighters === 'all' ?
  {
    attackers: attackers.filter(air).map(withDogfight),
    defenders: defenders.filter(willDogfight).map(withDefend),
    bombardingUnits: []
  } :
  {
    attackers: attackers.filter(unit => dogfighters.includes(unit.id)).map(withDogfight),
    defenders: defenders.filter(willDogfight).map(withDefend),
    bombardingUnits: []
  }
)

const withFlakVsAir = (defenders, attackers) => (
  attackers.some(air) ? defenders : defenders.filter(noAA)
)

export const preCasualtyCombatants = createSelector(
  combatantsWithoutDamage,
  bombardingUnits,
  dogfightIds,
  ({ attackers, defenders }, bombardingUnits, dogfighters) => (
    dogfighters ? dogfightCombatants(attackers, defenders, dogfighters) :
    { 
      attackers: modify(attackers), 
      defenders: withFlakVsAir(defenders, attackers).map(withDefend), 
      bombardingUnits
    }
  )
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
  getCombatUnderway,
  (territory, underway) => underway[territory.index]
)

export const allowRetreat = createSelector(
  getFocusTerritory,
  combatants,
  getAttackerCasualties,
  getAmphib,
  getCombatUnderway,
  ({ index }, { attackers }, casualties, amphib, combatUnderway) => (
    !amphib.territory[index] &&
    combatUnderway[index] && 
    attackers.some(({ id }) => !casualties.includes(id))
  )
)


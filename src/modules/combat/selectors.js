import { createSelector } from 'reselect'
import { combatants as combatantsWithoutDamage } from '../planCombat'
import { 
  getAmphib, 
  getAttackerCasualties, 
  getBombedTerritories, 
  getCombatUnderway, 
  getCurrentTerritoryIndex,
  getDogfights, 
  getRolls 
} from '../../selectors/stateSlices'
import { 
  getFocusTerritory, 
} from '../../selectors/getTerritory'
import { 
  air,
  attack, 
  attacks,
  defend, 
  idsToUnits, 
  noAA,
  survivors,
  willDogfight,
  withAttack, 
  withDefend,
  withDogfight
} from '../../selectors/units'
import PATHS from '../../paths'
export { getFocusTerritory, getAttackerCasualties }

export const isUnderway = createSelector(
  getFocusTerritory,
  getCombatUnderway,
  (territory, underway) => underway[territory.index]
)

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
    console.log({ defenders }) || dogfighters ? dogfightCombatants(attackers, defenders, dogfighters) :
    { 
      attackers: modify(attackers), 
      defenders: defenders.map(withDefend), 
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

const strengthRange = ({ attackers, defenders, bombardingUnits }) => {
  const supportedAttackers = [ ...attackers, ...bombardingUnits ]
  const dieMax = Math.max(...supportedAttackers.filter(attack).map(attack), 
    ...defenders.filter(defend).map(defend))
  return Array(dieMax).fill().map((n, i) => i + 1)
}

export const strengths = createSelector(
  combatants,
  strengthRange
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

const attacksAt = n => unit => unit.attack === n
const defendsAt = n => unit => defend(unit) === n
const totalAttacks = (total, unit) => total + attacks(unit)
const totalDefends = (total, unit) => total + 1

const arrangeRolls = (combatants, strengths, allRolls = {}) => {
  const rolls = allRolls[PATHS.COMBAT_ROLLS] || []
  const { attackers, defenders, bombardingUnits } = combatants
  const supportedAttackers = [ ...attackers, ...bombardingUnits ]
  let rollClone = rolls.slice(0)
  const rollsByStrength = { attackers: [], defenders: [] }
  strengths.forEach(n => {
    let attackRolls = supportedAttackers.filter(attacksAt(n)).reduce(totalAttacks, 0)
    rollsByStrength.attackers[n] = rollClone.splice(0, attackRolls)
    let defendRolls = defenders.filter(defendsAt(n)).reduce(totalDefends, 0)
    rollsByStrength.defenders[n] = rollClone.splice(0, defendRolls)
  })
  return rollsByStrength
}

export const combatRolls = createSelector(
  preCasualtyCombatants,
  strengths,
  getRolls,
  arrangeRolls
)

const hits = (rolls, side) => {
  return rolls[side].reduce((total, _rolls, i) => {
    return total + _rolls.filter(n => n <= i).length
  }, 0)
}

export const attackerCasualtyCount = createSelector(
  combatRolls,
  (rolls) => hits(rolls, 'defenders')
)

const byDefense = (a, b) => defend(a) - defend(b)

const _casualties = (combatants, rolls) => (
  combatants.defenders.sort(byDefense)
  .map(unit => unit.id).slice(0, hits(rolls, 'attackers'))
)

export const defenderCasualties = createSelector(
  combatantsWithoutDamage,
  combatRolls,
  (combatants, rolls) => _casualties(combatants, rolls)
)

export const rollCount = createSelector(
  combatantsWithoutDamage,
  bombardingUnits,
  ({ attackers, defenders }, bombardingUnits) => (
    attackers.concat(bombardingUnits).reduce(totalAttacks, 0)
    + defenders.reduce(totalDefends, 0)
  )
)


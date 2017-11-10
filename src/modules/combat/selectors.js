import { createSelector } from 'reselect'
import { combatants as combatantsWithoutDamage } from '../planCombat'
import { getFocusTerritory } from '../../selectors/getTerritory'
import { totalCount } from '../../lib/unit'
import { 
  attack, 
  attacks,
  defend, 
  survivors,
  withAttack, 
  withDefend 
} from '../../selectors/units'
import PATHS from '../../paths'
export { getFocusTerritory }

export const bombardingUnits = state => state.navalBombardment || []

export const rollCount = createSelector(
  combatantsWithoutDamage,
  bombardingUnits,
  ({ attackers, defenders }, bombardingUnits) => (
    (attackers.concat(bombardingUnits).concat(defenders))
    .reduce((total, unit) => total + attacks(unit), 0)
  )
)

export const attackerCasualties = createSelector(
  getFocusTerritory,
  territory => territory.attackerCasualties || []
)

export const combatants = createSelector(
  combatantsWithoutDamage,
  attackerCasualties,
  bombardingUnits,
  (combatants, attackerCasualties, bombardingUnits) => {
    let { attackers, defenders } = combatants 
    return { 
      attackers: modify(survivors(attackers, attackerCasualties)), 
      defenders: defenders.map(withDefend), 
      bombardingUnits: bombardingUnits.map(withAttack) 
    }
  }
)

const strengthRange = (combatants, bombardingUnits) => {
  const { attackers, defenders } = combatants
  const supportedAttackers = [ ...attackers, ...bombardingUnits ]
  const dieMax = Math.max(...supportedAttackers.filter(attack).map(attack), 
    ...defenders.filter(defend).map(defend))
  return Array(dieMax).fill().map((n, i) => i + 1)
}

export const strengths = createSelector(
  combatantsWithoutDamage,
  bombardingUnits,
  (combatants, bombardingUnits) => strengthRange(combatants, bombardingUnits)
);

const noAmphibiousUnits = (territory, attackers) => {
  const ids = Object.keys(territory.amphib)
  return !ids.some(id => attackers.find(attacker => attacker.ids.includes(id)))
}

export const allowRetreat = createSelector(
  getFocusTerritory,
  combatants,
  (territory, { attackers }) => territory.continueCombat && (!territory.amphib || noAmphibiousUnits(territory, attackers))
)

const artillery = unit => unit.type === 'artillery'
const infantry = unit => unit.type === 'infantry'

const modify = (units) => {
  const supportable = units.filter(artillery).length - units.filter(infantry).length
  if (supportable > 0) {
    // supported, unsupported, noninf
    return [ ...units.filter(infantry).slice(0, supportable).map(u => ({ ...u, attack: 2 })),
      ...units.filter(infantry).slice(supportable).map(withAttack),
      ...units.filter(u => u.type !== 'infantry').map(withAttack)]
  }
  return units.map(withAttack)
}

const arrangeRolls = (combatants, bombardingUnits, strengths, rolls = []) => {
  const { attackers, defenders } = combatants
  const supportedAttackers = [ ...attackers, ...bombardingUnits ]
  let rollClone = rolls.slice(0)
  const rollsByStrength = { attackers: [], defenders: [] }
  strengths.forEach(n => {
    let attackRolls = supportedAttackers.filter(unit => unit.attack === n).reduce(totalCount, 0)
    rollsByStrength.attackers[n] = rollClone.splice(0, attackRolls)
    let defendRolls = defenders.filter(unit => unit.defend === n).reduce(totalCount, 0)
    rollsByStrength.defenders[n] = rollClone.splice(0, defendRolls)
  })
  return rollsByStrength
}

export const combatRolls = createSelector(
  combatantsWithoutDamage,
  bombardingUnits,
  strengths,
  state => state.rolls[PATHS.COMBAT_ROLLS],
  (combatants, bombardingUnits, strengths, rolls) => arrangeRolls(combatants, bombardingUnits, strengths, rolls)
)

const hits = (rolls, side) => {
  return rolls[side].reduce((total, _rolls, i) => {
    return total + _rolls.filter(n => n <= i).length
  }, 0)
}

const _casualties = (combatants, rolls) => {
  return combatants.defenders
    .sort((a, b) => a.defend - b.defend).reduce((total, defender) => {
    return total.concat(defender.ids)
  }, []).slice(0, hits(rolls, 'attackers'))
}

export const defenderCasualties = createSelector(
  combatantsWithoutDamage,
  combatRolls,
  (combatants, rolls) => _casualties(combatants, rolls)
)

export const attackerCasualtyCount = createSelector(
  combatRolls,
  (rolls) => hits(rolls, 'defenders')
)

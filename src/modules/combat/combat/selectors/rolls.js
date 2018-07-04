import { createSelector } from 'reselect'
import { combatants as combatantsWithoutDamage } from '../../../planCombat'
import { 
  getCombatSubphase,
  getCurrentTerritoryIndex,
  getRolls 
} from '../../../../selectors/stateSlices'
import { 
  bombardingUnits,
  combatants, 
  preCasualtyCombatants, 
} from './combatants'
import { 
  AA,
  air,
  attack, 
  attacks,
  defend, 
  noAA,
  willDogfight
} from '../../../../selectors/units'
import PATHS from '../../../../paths'

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

const attacksAt = n => unit => unit.attack === n
const defendsAt = n => unit => defend(unit) === n
const totalAttacks = (total, unit) => total + attacks(unit)
const totalDefends = (total, unit) => total + 1

const getFlak = (rolls, defenders, n) => (
  rolls.reduce((total, roll, i) => (
    total + (AA(defenders[i]) && roll <= n) ? 1 : 0
  ), 0)
)

const rollsAtN = (collection, n, attackers, defenders, rolls) => {
  const attackRolls = attackers
    .filter(attacksAt(n))
    .reduce(totalAttacks, 0)
  collection.attackers[n] = rolls.splice(0, attackRolls)
  const defendsAtN = defenders.filter(defendsAt(n)) 
  const defendRolls = defendsAtN.reduce(totalDefends, 0)
  collection.defenders[n] = rolls.splice(0, defendRolls)
  if (defendsAtN.filter(AA).length) {
    const flak = getFlak(collection.defenders[n], defendsAtN, n)
    collection.flak = Math.min(attackers.filter(air).length, flak)
  }
  return collection
}

const arrangeRolls = (combatants, strengths, allRolls = {}) => {
  const rolls = allRolls[PATHS.COMBAT_ROLLS] || []
  const { attackers, defenders, bombardingUnits } = combatants
  const supportedAttackers = [ ...attackers, ...bombardingUnits ]
  let rollClone = rolls.slice(0)
  return strengths.reduce((rollsByStrength, n) => (
    rollsAtN(rollsByStrength, n, supportedAttackers, defenders, rollClone)
  ), { attackers: [], defenders: [] })
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
  rolls => hits(rolls, 'defenders')
)

export const airCasualtyCount = createSelector(
  combatRolls,
  rolls => rolls.flak || 0
)

const byDefense = (a, b) => defend(a) - defend(b)

const _casualties = (combatants, rolls) => (
  combatants.defenders
    .filter(noAA) //ASK: does this make sense?
    .sort(byDefense)
    .map(unit => unit.id).slice(0, hits(rolls, 'attackers'))
)

export const defenderCasualties = createSelector(
  combatantsWithoutDamage,
  combatRolls,
  _casualties
)

export const rollCount = createSelector(
  combatantsWithoutDamage,
  bombardingUnits,
  getCombatSubphase,
  getCurrentTerritoryIndex,
  ({ attackers, defenders }, bombardingUnits, subphase, territoryIndex) => { 
    if (subphase[territoryIndex] === 'dogfight') {
      return attackers.filter(air).length + defenders.filter(willDogfight).length
    } else {
      return attackers.concat(bombardingUnits).reduce(totalAttacks, 0)
        + defenders.reduce(totalDefends, 0)
    }
  }
)


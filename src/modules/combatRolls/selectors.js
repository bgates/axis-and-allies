import { createSelector } from 'reselect'
import { mergeBoardAndTerritories, getFocusTerritory } from '../../selectors/mergeBoardAndTerritories'
import { combatants } from '../planCombat'
import { allUnits } from '../../lib/territory'
import { attack, attacks, defend } from '../../selectors/units'
import PATHS from '../../paths'

const _strengths = (combatants, bombardingUnits) => {
  const { attackers, defenders } = combatants
  const supportedAttackers = [ ...attackers, ...bombardingUnits ]
  const dieMax = Math.max(...supportedAttackers.filter(attack).map(attack), 
    ...defenders.filter(defend).map(defend))
  return Array(dieMax).fill().map((n, i) => i + 1)
}

//TODO: this isn't right
export const bombardingUnits = createSelector(
  state => []
)

export const strengths = createSelector(
  combatants,
  bombardingUnits,
  (combatants, bombardingUnits) => _strengths(combatants, bombardingUnits)
);

const totalAttacks = (total, unit) => total + attacks(unit)
const totalDefends = (total, unit) => total + 1

const arrangeRolls = (combatants, bombardingUnits, strengths, rolls = []) => {
  const { attackers, defenders } = combatants
  const supportedAttackers = [ ...attackers, ...bombardingUnits ]
  let rollClone = rolls.slice(0)
  const rollsByStrength = { attackers: [], defenders: [] }
  strengths.forEach(n => {
    let attackRolls = supportedAttackers.filter(unit => attack(unit) === n).reduce(totalAttacks, 0)
    rollsByStrength.attackers[n] = rollClone.splice(0, attackRolls)
    let defendRolls = defenders.filter(unit => defend(unit) === n).reduce(totalDefends, 0)
    rollsByStrength.defenders[n] = rollClone.splice(0, defendRolls)
  })
  return rollsByStrength
}

export const combatRolls = createSelector(
  combatants,
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
  combatants,
  combatRolls,
  (combatants, rolls) => _casualties(combatants, rolls)
)

export const attackerCasualtyCount = createSelector(
  combatRolls,
  (rolls) => hits(rolls, 'defenders')
)

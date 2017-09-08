import { createSelector } from 'reselect';
import { combatants } from '../planCombat';
import { unitCount } from '../../lib/unit';
import PATHS from '../../paths';

const _strengths = (combatants) => {
  const { attackers, defenders } = combatants;
  const dieMax = Math.max(...attackers.map(u => u.attack), 
    ...defenders.map(u => u.defend));
  return Array(dieMax).fill().map((n, i) => i + 1);
}

export const strengths = createSelector(
  combatants,
  combatants => _strengths(combatants)
);

const arrangeRolls = (combatants, strengths, rolls = []) => {
  const { attackers, defenders } = combatants;
  let rollClone = rolls.slice(0);
  const rollsByStrength = { attackers: [], defenders: [] }
  strengths.forEach(n => {
    let attackRolls = attackers.filter(unit => unit.attack === n).reduce(unitCount, 0)
    rollsByStrength.attackers[n] = rollClone.splice(0, attackRolls)
    let defendRolls = defenders.filter(unit => unit.defend === n).reduce(unitCount, 0)
    rollsByStrength.defenders[n] = rollClone.splice(0, defendRolls)
  })
  return rollsByStrength
}

export const combatRolls = createSelector(
  combatants,
  strengths,
  state => state.rolls[PATHS.COMBAT_ROLLS],
  (combatants, strengths, rolls) => arrangeRolls(combatants, strengths, rolls)
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

import { createSelector } from 'reselect';
import { combatants } from '../planCombat';
import { strengths } from '../combat';

const unitCount = (total, unit) => total + unit.ids.length;

const arrangeRolls = (combatants, strengths, rolls) => {
  const { attackers, defenders } = combatants;
  const rollsByStrength = { attackers: [], defenders: [] }
  strengths.forEach(n => {
    let attackRolls = attackers.filter(unit => unit.attack === n).reduce(unitCount, 0)
    rollsByStrength.attackers[n] = rolls.splice(0, attackRolls)
    let defendRolls = defenders.filter(unit => unit.defend === n).reduce(unitCount, 0)
    rollsByStrength.defenders[n] = rolls.splice(0, defendRolls)
  })
  return rollsByStrength
}

export const combatRolls = createSelector(
  combatants,
  strengths,
  state => state.rolls['/combat-rolls'],
  (combatants, strengths, rolls) => arrangeRolls(combatants, strengths, rolls)
)

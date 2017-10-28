import { createSelector } from 'reselect';
import { mergeBoardAndTerritories, getFocusTerritory } from '../../selectors/mergeBoardAndTerritories'
import { combatants } from '../planCombat';
import { totalCount } from '../../lib/unit';
import { allUnits } from '../../lib/territory'
import PATHS from '../../paths';

const _strengths = (combatants, bombardingUnits) => {
  const { attackers, defenders } = combatants;
  const supportedAttackers = [ ...attackers, ...bombardingUnits ]
  console.log(supportedAttackers)
  const dieMax = Math.max(...supportedAttackers.filter(u => u.attack).map(u => u.attack), 
    ...defenders.filter(u => u.defend).map(u => u.defend));
  return Array(dieMax).fill().map((n, i) => i + 1);
}

export const bombardingUnits = createSelector(
  mergeBoardAndTerritories,
  getFocusTerritory,
  (board, territory) => Object.keys(territory.bombard)
  .map(key => {
    const ids = territory.bombard[key]
    const units = allUnits(board[key])
    return ids.map(id => units.find(u => u.ids.includes(id)))
  }).reduce((total, each) => [ ...total, ...each ], [])
)

export const strengths = createSelector(
  combatants,
  bombardingUnits,
  (combatants, bombardingUnits) => _strengths(combatants, bombardingUnits)
);

const arrangeRolls = (combatants, bombardingUnits, strengths, rolls = []) => {
  const { attackers, defenders } = combatants;
  const supportedAttackers = [ ...attackers, ...bombardingUnits ]
  let rollClone = rolls.slice(0);
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

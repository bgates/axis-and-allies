import { createSelector } from 'reselect';
import { mergeBoardAndTerritories } from '../../selectors/mergeBoardAndTerritories'
import { combatants } from '../planCombat'
import unitTypes from '../../config/unitTypes'

const _retreatOptions = (attackers, territories) => {
  if (attackers.every(attacker => attacker.air)) {
    // TODO: air retreat - all friendly territories every unit can reach
  } else {
    const retreatOptionIndexes = attackers.reduce((options, attacker) => options.concat(attacker.originIndexes), [])
    return territories.filter(territory => retreatOptionIndexes.includes(territory.index))
  }
}
  
export const retreatOptions = createSelector(
  mergeBoardAndTerritories,
  combatants,
  (territories, { attackers }) => _retreatOptions(attackers, territories)
)

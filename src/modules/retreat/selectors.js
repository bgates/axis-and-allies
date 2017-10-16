import { createSelector } from 'reselect';
import { mergeBoardAndTerritories, getFocusTerritory } from '../../selectors/mergeBoardAndTerritories'
import { combatants } from '../planCombat'
import unitTypes from '../../config/unitTypes'

const _retreatOptions = (attackers, territory, territories) => {
  if (attackers.every(attacker => attacker.air)) {
    // TODO: air retreat - all friendly territories every unit can reach
  } else {
    const retreatOptionIndexes = attackers.reduce((options, attacker) => (
      options.concat(attacker.originIndexes || attacker.originIndex)
    ), []).filter(option => territory.adjacentIndexes.includes(option))
    return territories.filter(_territory => retreatOptionIndexes.includes(_territory.index))
  }
}
  
export const retreatOptions = createSelector(
  mergeBoardAndTerritories,
  getFocusTerritory,
  combatants,
  (territories, territory, { attackers }) => _retreatOptions(attackers, territory, territories)
)

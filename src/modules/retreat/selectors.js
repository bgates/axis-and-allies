import { createSelector } from 'reselect';
import { mergeBoardAndTerritories, getFocusTerritory } from '../../selectors/mergeBoardAndTerritories'
import { getCurrentPower } from '../../selectors/getCurrentPower'
import { territoriesInRange, canLandInTerritory } from '../planCombat'
import unitTypes from '../../config/unitTypes'

const flightRange = unit => unit.movement - unit.distance

const _retreatOptions = (currentPower, territory, territories) => {
  const survivingAttackers = territory.unitsFrom.filter(unit => (
    !unit.ids.every(id => territory.attackerCasualties.includes(id)))
  )
  if (survivingAttackers.every(attacker => attacker.air)) {
    const range = survivingAttackers.map(flightRange).sort((a, b) => a - b)[0]
    const territoriesObj = territoriesInRange(territories, currentPower, territory, canLandInTerritory, range)
    return Object.values(territoriesObj).reduce((result, arr) => result.concat(arr), [])
  } else {
    const retreatOptions = survivingAttackers.reduce((options, attacker) => (
      options.concat(attacker.originIndexes || attacker.originIndex)
    ), []).filter(option => territory.adjacentIndexes.includes(option))
    return territories.filter(t => retreatOptions.includes(t.index))
  }
}
  
export const retreatOptions = createSelector(
  getCurrentPower,
  mergeBoardAndTerritories,
  getFocusTerritory,
  (currentPower, territories, territory) => _retreatOptions(currentPower, territory, territories)
)

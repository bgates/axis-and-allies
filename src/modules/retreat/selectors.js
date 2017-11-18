import { createSelector } from 'reselect'
import { mergeBoardAndTerritories, getFocusTerritory } from '../../selectors/getTerritory'
import { getCurrentPower } from '../../selectors/getCurrentPower'
import { territoriesInRange, getFlights, canLandInTerritory } from '../planCombat'
import { attackerCasualties } from '../combat'
import { air, movement, getAllUnits } from '../../selectors/units'

const individualRange = flights => unit => movement(unit) - flights[unit.id]

const _retreatOptions = (currentPower, territories, territory, flights, casualties, allUnits) => {
  const survivors = territory.units.filter(({ id }) => !casualties.includes(id))
  if (survivors.every(air)) {
    const range = survivors.map(individualRange(flights)).sort((a, b) => a - b)[0]
    const territoriesObj = territoriesInRange(territories, currentPower, territory, canLandInTerritory, range, allUnits)
    return Object.values(territoriesObj).reduce((result, arr) => result.concat(arr), [])
  } else {
    const retreatOptions = survivors.map(attacker => attacker.originIndex)
                                    .filter(option => territory.adjacentIndexes.includes(option))
    return territories.filter(t => retreatOptions.includes(t.index))
  }
}
  
export const retreatOptions = createSelector(
  getCurrentPower,
  mergeBoardAndTerritories,
  getFocusTerritory,
  attackerCasualties,
  getFlights,
  getAllUnits,
  _retreatOptions
)

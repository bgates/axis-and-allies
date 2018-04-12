import { createSelector } from 'reselect'
import { getAllOutbound, getAttackerCasualties, getFlights } from '../../../selectors/stateSlices'
import { mergeBoardAndTerritories, getCommittedUnits, getFocusTerritory } from '../../../selectors/getTerritory'
import { getCurrentPower } from '../../../selectors/getCurrentPower'
import { territoriesInRange, canLandInTerritory } from '../../planCombat'
import { air, movement, getAllUnits } from '../../../selectors/units'
export { getAttackerCasualties, getFocusTerritory }

const individualRange = flights => unit => movement(unit) - flights[unit.id]

const _retreatOptions = (currentPower, territories, territory, units, casualties, flights, allUnits, outbound) => {
  const survivors = units.filter(({ id }) => !casualties.includes(id))
  if (survivors.every(air)) {
    const range = survivors.map(individualRange(flights)).sort((a, b) => a - b)[0]
    const territoriesObj = territoriesInRange(territories, currentPower, territory, canLandInTerritory, range, allUnits)
    return Object.values(territoriesObj).reduce((result, arr) => result.concat(arr), [])
  } else {
    const retreatOptions = survivors.map(attacker => outbound[attacker.id])
                                    .filter(option => territory.adjacentIndexes.includes(option))
    return territories.filter(t => retreatOptions.includes(t.index))
  }
}
  
export const retreatOptions = createSelector(
  getCurrentPower,
  mergeBoardAndTerritories,
  getFocusTerritory,
  getCommittedUnits,
  getAttackerCasualties,
  getFlights,
  getAllUnits,
  getAllOutbound,
  _retreatOptions
)

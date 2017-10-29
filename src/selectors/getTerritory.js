import { createSelector } from 'reselect'
import { omit } from 'ramda'
import { sameSide } from '../config/initialPowers'
import territoryData from '../config/territories.json'

export const isLand = (territory) => !territory.sea
export const isSea = (territory) => territory.sea

export const getAllUnits = (state) => state.units

export const getAllTerritories = (state) => state.territories

export const getTerritoryData = (_, territoryIndex) => territoryData[territoryIndex]

export const getTerritory = (state, territoryIndex) => state.territories[territoryIndex]

const idsToUnits = (ids, units) => ids.map(id => units[id])

export const getTerritoryUnits = createSelector(
  getTerritory,
  getAllUnits,
  ({ unitIds }, units) => idsToUnits(unitIds, units)
)

export const isEnemy = ({ currentPower, unitIds }, activePower, units) => {
  if (currentPower && !['Neutrals', 'Oceans'].includes(currentPower)) {
    return !sameSide(currentPower, activePower)
  }
  return idsToUnits(unitIds, units).some(unit => !sameSide(unit.power, activePower))
}

const getStaticAndDynamicTerritory = (state, territoryIndex, units) => (
  { 
    ...omit('dimensions', getTerritoryData(state, territoryIndex)), 
    ...getTerritory(state, territoryIndex),
    units
  }
)

export const getFocusTerritory = createSelector(
  state => getTerritoryUnits(state, state.phase.territoryIndex),
  state => state,
  state => state.phase,
  (units, state, { territoryIndex }) => getStaticAndDynamicTerritory(state, territoryIndex, units)
)

export const mergeBoardAndTerritories = createSelector(
  getAllUnits,
  getAllTerritories,
  (allUnits, territories) => territories.map(({ currentPower, unitIds }, index) => {
    const { name, original_power, sea, adjacentIndexes } = territoryData[index]
    const units = idsToUnits(unitIds, allUnits)
    return { currentPower, units, name, original_power, sea, adjacentIndexes, index}
  })
)
   
export const getTerritoriesWithIpcValues = createSelector(
  getAllTerritories,
  territories => territories.map(({ currentPower }, index) => {
    const { ipc_value } = territoryData[index]
    return { currentPower, ipc_value }
  })
)

import { createSelector } from 'reselect'
import { omit, values, groupBy } from 'ramda'
import { sameSide } from '../config/initialPowers'
import territoryData from '../config/territories.json'
import { getAllUnits } from './units'

export const isLand = (territory) => !territory.sea
export const isSea = (territory) => territory.sea

export const getAllTerritories = (state) => state.territories

export const getTerritoryData = (_, territoryIndex) => territoryData[territoryIndex]

export const getTerritory = (state, territoryIndex) => state.territories[territoryIndex]

export const getOutboundUnits = (state, territoryIndex) => (
  state.unitOrigin[territoryIndex] || []
)

export const getInboundUnits = (state, territoryIndex) => (
  state.unitDestination[territoryIndex] || []
)

export const idsToUnits = (ids, units) => ids.map(id => units[id])

export const getTerritoryUnits = createSelector(
  getTerritory,
  getAllUnits,
  ({ unitIds }, units) => idsToUnits(unitIds, units)
)

export const getMovedUnitIds = state => state.unitDestination

const isNeutral = ({ currentPower }) => currentPower === 'Neutrals'

export const isFriendly = (territory, currentPower, units) => (  
  !isNeutral(territory) && !isEnemy(territory, currentPower, units)
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
    index: territoryIndex,
    units
  }
)

export const getFocusTerritory = createSelector(
  state => getTerritoryUnits(state, state.phase.territoryIndex),
  state => state,
  state => state.phase,
  (units, state, { territoryIndex }) => getStaticAndDynamicTerritory(state, territoryIndex, units)
)

export const getCommittedIds = createSelector(
  getFocusTerritory,
  getMovedUnitIds,
  ({ index }, movedUnitIds) => movedUnitIds[index] || []
)

export const getCommittedUnits = createSelector(
  getCommittedIds,
  getAllUnits,
  idsToUnits
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

const same = unit => unit.type + unit.power

const groupedUnits = (units) => (
  values(groupBy(same)(units))
    .map(group => ({ ...group[0], qty: group.length }))
)

const remove = (array) => id => !array.includes(id)

export const getUnits = createSelector(
  getTerritory,
  getAllUnits,
  getOutboundUnits,
  getInboundUnits,
  ({ unitIds }, allUnits, outbound, inbound) => (
    groupedUnits(unitIds
      .concat(inbound)
      .filter(remove(outbound))
      .map(id => allUnits[id]))
  )
)

export const hasIndustrialComplex = createSelector(
  getAllUnits,
  getTerritory,
  (allUnits, territory) => territory.unitIds.find(id => allUnits[id].type === 'industrial complex')
)

export const amphibOrigins = (amphib, inbound, index) => (
  amphib.territory[index] || []).map(transportId => inbound[transportId]
)


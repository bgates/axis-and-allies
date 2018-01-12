import { createSelector } from 'reselect'
import { omit, values, groupBy } from 'ramda'
import { sameSide } from '../config/initialPowers'
import territoryData from '../config/territories.json'
import { 
  getCurrentTerritoryIndex, 
  getDestinations, 
  getPlacement,
  getLandingPlanes
} from './stateSlices'
import { getAllUnits, idsToUnits, bombCapacity } from './units'
import { getCurrentPowerName } from './getCurrentPower'

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

export const getTerritoryUnits = createSelector(
  getTerritory,
  getAllUnits,
  ({ unitIds }, units) => idsToUnits(unitIds, units)
)

export const adjacents = (board, territory) => (
  territory.adjacentIndexes.map(i => board[i])
)

const isNeutral = ({ currentPower }) => currentPower === 'Neutrals'
export const nonNeutral = (territory) => !isNeutral(territory)

export const isFriendly = (territory, currentPower, units) => (  
  !isNeutral(territory) && !isEnemy(territory, currentPower)
)

export const isEnemy = ({ currentPower, units = []}, activePower) => {
  if (currentPower && !['Neutrals', 'Oceans'].includes(currentPower)) {
    return !sameSide(currentPower, activePower)
  }
  return units.some(unit => !sameSide(unit.power, activePower))
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
  getCurrentTerritoryIndex,
  (units, state, territoryIndex) => getStaticAndDynamicTerritory(state, territoryIndex, units)
)

export const getCommittedIds = createSelector(
  getFocusTerritory,
  getDestinations,
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
    const { name, original_power, sea, adjacentIndexes, seaPort, canalToIndex, canalControlIndex } = territoryData[index]
    const units = idsToUnits(unitIds, allUnits)
    return { currentPower, units, name, original_power, sea, seaPort, adjacentIndexes, index, canalToIndex, canalControlIndex }
  })
)
window.getBoard = mergeBoardAndTerritories
export const getTerritoriesWithIpcValues = createSelector(
  getAllTerritories,
  territories => territories.map(({ currentPower }, index) => {
    const { ipc_value, sea, original_power } = territoryData[index]
    return { currentPower, ipc_value, sea, original_power, index }
  })
)

const same = unit => unit.type + unit.power

const groupedUnits = (units) => (
  values(groupBy(same)(units))
    .map(group => ({ ...group[0], qty: group.length }))
)

const remove = (array) => id => !array.includes(id)

const newUnits = (placement, power, index) => (
  Object.keys(placement).reduce((units, type) => (
    placement[type][index] ? units.concat(new Array(placement[type][index]).fill({ type, power, id: 0 })) : units
  ), [])
)
export const getUnits = createSelector(
  getTerritory,
  getAllUnits,
  getOutboundUnits,
  getInboundUnits,
  getCurrentPowerName,
  getPlacement,
  getLandingPlanes,
  (_, territoryIndex) => territoryIndex,
  ({ unitIds }, allUnits, outbound, inbound, currentPower, placement, landPlanes, territoryIndex) => (
    groupedUnits(unitIds
      .filter(remove(outbound))
      .concat(inbound)
      .filter(id => !landPlanes[id])
      .concat(Object.keys(landPlanes).filter(id => landPlanes[id] === territoryIndex))
      .map(id => allUnits[id])
      .concat(newUnits(placement, currentPower, territoryIndex))
    )
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
export const getBombingUnits = state => state.strategicBombing.bombingUnits

export const bomberPayload = createSelector(
  getCommittedUnits,
  getBombingUnits,
  (state, territoryIndex) => territoryIndex,
  (units, bombers, index) => (
    units.filter(({ id }) => bombers[id]).reduce((total, unit) => total + bombCapacity(unit), 0)
  )
)


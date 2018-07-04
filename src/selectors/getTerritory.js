// @flow
import { createSelector } from 'reselect'
import { omit, values, groupBy, uniq } from 'ramda'
import { sameSide } from '../config/initialPowers'
import territoryData from '../config/territories'
import { 
  getCurrentTerritoryIndex, 
  getDestinations, 
  getPlacement,
  getLandingPlanes
} from './stateSlices'
import { getAllUnits, idsToUnits, bombCapacity, industry } from './units'
import { getCurrentPowerName } from './getCurrentPower'
import type { PowerName } from '../actions/types'
import type { UnitType } from './units'

type Territory = {
  sea?: boolean,
  adjacentIndexes: Array<number>,
  currentPower: PowerName,
  units: Array<UnitType>
}
type ThinTerritory = {
  unitIds: Array<number>,
  currentPower: PowerName
}
type State = {
  territories: Array<ThinTerritory>,
  unitDestination: { [string]: Array<number> }
}
export const isLand = (territory:Territory) => !territory.sea
export const isSea = (territory:Territory) => territory.sea

const getAllTerritories = (state) => state.territories

export const getTerritoryData = (_:any, territoryIndex:number) => territoryData[territoryIndex]

export const getTerritory = (state:State, territoryIndex:number) => state.territories[territoryIndex]

const getOutboundUnits = (state, territoryIndex) => (
  state.unitOrigin[territoryIndex] || []
)

export const getInboundUnits = (state:State, territoryIndex:number) => (
  state.unitDestination[territoryIndex.toString()] || []
)

const getTerritoryUnits = createSelector(
  getTerritory,
  getAllUnits,
  ({ unitIds }, units) => idsToUnits(unitIds, units)
)

export const adjacents = (board:Array<Territory>, territory:Territory) => (
  territory.adjacentIndexes.map(i => board[i])
)

const isNeutral = ({ currentPower }) => currentPower === 'Neutrals'
export const nonNeutral = (territory:Territory) => !isNeutral(territory)

export const isFriendly = (territory:Territory, currentPower:PowerName, units:Array<UnitType>) => (  
  !isNeutral(territory) && !isEnemy(territory, currentPower)
)

export const isEnemy = ({ currentPower, units = []}:Territory, activePower:PowerName) => {
  if (currentPower && !['Neutrals', 'Oceans'].includes(currentPower)) {
    return !sameSide(currentPower, activePower)
  }
  return units.some(unit => !sameSide(unit.power, activePower))
}

const getStaticAndDynamicTerritory = (state, territoryIndex, units) => (
  { 
    ...omit(['dimensions'], getTerritoryData(state, territoryIndex)), 
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
  (allUnits, territory) => territory.unitIds.find(id => industry(allUnits[id]))
)

export type Amphib = {
  territory: { [string]:Array<number> }
}
export const amphibOrigins = (amphib:Amphib, inbound:{[string]:Array<number>}, index:number) => (
  uniq(
    (amphib.territory[index.toString()] || [])
    .map(transportId => inbound[transportId.toString()])
  )
)
type BombsInState = { strategicBombing: { bombingUnits:Array<number> } }
export const getBombingUnits = (state:BombsInState) => state.strategicBombing.bombingUnits

export const bomberPayload = createSelector(
  getCommittedUnits,
  getBombingUnits,
  (state, territoryIndex) => territoryIndex,
  (units, bombers, index) => (
    units.filter(({ id }) => bombers[id]).reduce((total, unit) => total + bombCapacity(unit), 0)
  )
)

export const getFlakTargetCount = createSelector(
  getCommittedUnits,
  getBombingUnits,
  (state, territoryIndex) => territoryIndex,
  (units, bombers, index) => units.filter(({ id }) => bombers[id]).length
)

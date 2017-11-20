import { createSelector } from 'reselect'
import { getAmphib } from '../planCombat'
import { getCurrentTerritoryIndex, getTerritoryData } from '../../selectors/getTerritory'
import { idsToUnits, getAllUnits } from '../../selectors/units'

const getCargoIds = (state, id) => state.transport.transporting[id] || []

export const getCargo = createSelector(
  getCargoIds,
  getAllUnits,
  state => state.outboundUnits,
  (ids, units, outbound) => idsToUnits(ids, units).map(unit => ({ ...unit, originName: getTerritoryData(null, outbound[unit.id]).name }))
)

const hasUnitMoved = (state, id) => state.outboundUnits[id]

export const getAvailability = createSelector(
  getCargo,
  hasUnitMoved,
  (cargo, destination) => !cargo.length && !destination
)

export const isCommittedHere = createSelector(
  getCurrentTerritoryIndex,
  getAmphib,
  (state, unitId) => unitId,
  (territoryIndex, amphib, unitId) => amphib.transport[unitId] === territoryIndex
)

import { createSelector } from 'reselect'
import { getAllUnits, idsToUnits, getTerritoryData } from '../../selectors/getTerritory'

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

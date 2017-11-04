import { createSelector } from 'reselect'

export const getCargo = (state, id) => state.transport.transporting[id] || []

const hasUnitMoved = (state, id) => state.outboundUnits[id]

export const getAvailability = createSelector(
  getCargo,
  hasUnitMoved,
  (cargo, destination) => !cargo.length && !destination
)

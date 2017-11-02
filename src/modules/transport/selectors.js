import { createSelector } from 'reselect'

export const getCargo = (state, id) => state.transport.transporting[id] || []

export const getAvailability = createSelector(
  getCargo,
  cargo => !cargo.length
)

import { omit } from 'ramda'
import { LOAD_TRANSPORT, UNCOMMIT_UNITS, COMBAT_UNDERWAY } from '../../actions'

const initialState = {
  transporting: {},
  transportedBy: {},
  newlyLoaded: []
}

const transport = (state = initialState, action) => {
  switch (action.type) {
  case LOAD_TRANSPORT: {
    const { transport: { id }, unitIds } = action
    const transporting = { ...state.transporting, [id]: unitIds }
    let transportedBy = { ...state.transportedBy }
    const { newlyLoaded } = state
    unitIds.forEach(_id => transportedBy[_id] = id)
    return { transporting , transportedBy, newlyLoaded: newlyLoaded.concat(id) }
  }
  case UNCOMMIT_UNITS: {
    const { unitIds } = action
    const transportId = unitIds[0]
    if (state.newlyLoaded.includes(transportId)) {
      const transporting = omit([String(transportId)], state.transporting)
      const transportedBy = omit(state.transporting[transportId].map(String), state.transportedBy)
      const newlyLoaded = state.newlyLoaded.filter(id => id !== transportId)
      return { transporting, transportedBy, newlyLoaded }
    } else {
      return state
    }
  }
  case COMBAT_UNDERWAY: {
    const { transportIds, unitIds } = action
    const newlyLoaded = state.newlyLoaded.filter(id => !transportIds.includes(id))
    const transporting = omit(transportIds.map(String), state.transporting)
    const transportedBy = omit(unitIds.map(String), state.transportedBy)
    return { transporting, transportedBy, newlyLoaded }
  }
  default:
    return state
  }
}

export default transport


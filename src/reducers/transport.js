import { omit } from 'ramda'
import { LOAD_TRANSPORT, UNCOMMIT_UNITS } from '../actions'

const initialState = {
  transporting: {},
  transportedBy: {},
  newlyLoaded: []
}

const transport = (state = initialState, action) => {
  switch (action.type) {
  case LOAD_TRANSPORT: {
    const { transportId, unitIds } = action
    const transporting = { ...state.transporting, [transportId]: unitIds }
    let transportedBy = { ...state.transportedBy }
    let { newlyLoaded } = state
    unitIds.forEach(id => transportedBy[id] = transportId)
    return { transporting , transportedBy, newlyLoaded: newlyLoaded.concat(transportId) }
  }
  case UNCOMMIT_UNITS: {
    const { unitIds } = action
    const transportId = unitIds[0]
    if (state.newlyLoaded.includes(transportId)) {
      const transporting = omit(transportId, state.transporting)
      const transportedBy = omit(state.transporting[transportId], state.transportedBy)
      return { transporting, transportedBy }
    } else {
      return state
    }
  }
  default:
    return state
  }
}

export default transport


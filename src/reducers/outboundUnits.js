import { omit } from 'ramda'
import { 
  COMMIT_UNITS, 
  UNCOMMIT_UNITS, 
  LOAD_TRANSPORT,
  COMMIT_TO_STRATEGIC_BOMBING
} from '../actions'

const outboundUnits = (state = {}, action) => {
  const { originIndex, unitIds } = action
  switch (action.type) {
  case COMMIT_TO_STRATEGIC_BOMBING:
  case COMMIT_UNITS: {
    let outbound = { ...state }
    unitIds.forEach(id => outbound[id] = originIndex)
    return outbound 
  }
  case UNCOMMIT_UNITS: {
    return omit(unitIds.map(String), state)
  }
  case LOAD_TRANSPORT: {
    const { transport, unitIds, originIndex } = action
    let outbound = { ...state }
    outbound[transport.id] = transport.originIndex
    unitIds.forEach(id => outbound[id] = originIndex)
    return outbound
  }
  default:
    return state
  }
}

export default outboundUnits
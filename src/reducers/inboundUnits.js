import { omit } from 'ramda'
import { 
  COMMIT_UNITS, 
  UNCOMMIT_UNITS, 
  LOAD_TRANSPORT,
  COMMIT_TO_STRATEGIC_BOMBING,
  REMOVE_CASUALTIES,
  RETREAT,
  NEXT_TURN
} from '../actions'

const inboundUnits = (state = {}, action) => {
  const { targetIndex, unitIds, type } = action
  switch (type) {
  case COMMIT_TO_STRATEGIC_BOMBING:
  case COMMIT_UNITS: {
    let inbound = { ...state }
    unitIds.forEach(id => { inbound[id] = targetIndex })
    return inbound 
  }
  case UNCOMMIT_UNITS: {
    return omit(unitIds.map(String), state)
  }
  case LOAD_TRANSPORT: {
    const { transport, targetIndex, unitIds } = action
    let inbound = { ...state }
    unitIds.concat(transport.id).forEach(id => inbound[id] = targetIndex)
    return inbound
  }
  case REMOVE_CASUALTIES: {
    return omit(action.attackerCasualties.map(String), state)
  }
  case RETREAT: {
    return omit(action.survivors.map(String), state)
  }
  case NEXT_TURN: {
    return {}
  }
  default:
    return state
  }
}

export default inboundUnits

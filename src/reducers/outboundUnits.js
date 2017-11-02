import { omit } from 'ramda'
import { COMMIT_UNITS, UNCOMMIT_UNITS } from '../actions'

const outboundUnits = (state = {}, action) => {
  const { originIndex, unitIds } = action
  switch (action.type) {
  case COMMIT_UNITS: {
    let outbound = { ...state }
    unitIds.forEach(id => { outbound[id] = originIndex })
    return outbound 
  }
  case UNCOMMIT_UNITS: {
    return omit(unitIds.map(String), state)
  }
  default:
    return state
  }
}

export default outboundUnits

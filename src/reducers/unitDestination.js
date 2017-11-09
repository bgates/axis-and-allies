import { 
  COMMIT_UNITS, 
  UNCOMMIT_UNITS, 
  LOAD_TRANSPORT,
  COMMIT_TO_STRATEGIC_BOMBING
} from '../actions'
import { add, remove } from './unitOrigin'

const unitDestination = (state = {}, action) => {
  const { destinationIndex, unitIds } = action
  switch (action.type) {
  case COMMIT_TO_STRATEGIC_BOMBING:
  case COMMIT_UNITS: {
    return { 
      ...state,
      [destinationIndex]: add(state[destinationIndex], unitIds)
    }
  }
  case UNCOMMIT_UNITS: {
    return { 
      ...state,
      [destinationIndex]: remove(state[destinationIndex], unitIds)
    }
  }
  case LOAD_TRANSPORT: {
    const { transport, unitIds, destinationIndex } = action
    return {
      ...state,
      [destinationIndex]: add(state[destinationIndex], unitIds.concat(transport.id))
    }
  }
  default:
    return state
  }
}

export default unitDestination

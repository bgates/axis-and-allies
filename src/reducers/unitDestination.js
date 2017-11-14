import { 
  COMMIT_UNITS, 
  UNCOMMIT_UNITS, 
  LOAD_TRANSPORT,
  COMMIT_TO_STRATEGIC_BOMBING,
  REMOVE_CASUALTIES,
  LOSE_ATTACK
} from '../actions'
import { add, remove } from './unitOrigin'

const unitDestination = (state = {}, action) => {
  const { targetIndex, unitIds } = action
  switch (action.type) {
  case COMMIT_TO_STRATEGIC_BOMBING:
  case COMMIT_UNITS: {
    return { 
      ...state,
      [targetIndex]: add(state[targetIndex], unitIds)
    }
  }
  case UNCOMMIT_UNITS: {
    return { 
      ...state,
      [targetIndex]: remove(state[targetIndex], unitIds)
    }
  }
  case LOAD_TRANSPORT: {
    const { transport, unitIds, targetIndex } = action
    return {
      ...state,
      [targetIndex]: add(state[targetIndex], unitIds.concat(transport.id))
    }
  }
  case LOSE_ATTACK:
  case REMOVE_CASUALTIES: {
    const { territoryIndex, attackerCasualties } = action
    return {
      ...state,
      [territoryIndex]: remove(state[territoryIndex], attackerCasualties)
    }
  }
  default:
    return state
  }
}

export default unitDestination

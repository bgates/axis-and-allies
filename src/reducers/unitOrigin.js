import { 
  COMMIT_UNITS, 
  UNCOMMIT_UNITS, 
  LOAD_TRANSPORT,
  COMMIT_TO_STRATEGIC_BOMBING,
  NEXT_TURN
} from '../actions'

export const add = (array = [], ids) => array.concat(ids)

export const remove = (array = [], ids) => array.filter(id => !ids.includes(id))

const unitOrigin = (state = {}, action) => {
  const { originIndex, unitIds } = action
  switch (action.type) {
  case COMMIT_TO_STRATEGIC_BOMBING:
  case COMMIT_UNITS: {
    return { 
      ...state, 
      [originIndex]: add(state[originIndex], unitIds)
    } 
  }
  case UNCOMMIT_UNITS: {
    return { 
      ...state, 
      [originIndex]: remove(state[originIndex], unitIds)
    }
  }
  case LOAD_TRANSPORT: {
    const { transport, unitIds, originIndex } = action
    return {
      ...state,
      [originIndex]: add(state[originIndex], unitIds),
      [transport.originIndex]: add(state[transport.originIndex], transport.id)
    }
  }
  case NEXT_TURN: {
    return {}
  }
  default:
    return state
  }
}

export default unitOrigin

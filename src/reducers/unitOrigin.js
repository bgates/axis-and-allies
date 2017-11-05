import { COMMIT_UNITS, UNCOMMIT_UNITS, LOAD_TRANSPORT } from '../actions'

const add = (array = [], ids) => array.concat(ids)

const remove = (array, ids) => array.filter(id => !ids.includes(id))

const unitOrigin = (state = {}, action) => {
  const { originIndex, unitIds } = action
  switch (action.type) {
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
  default:
    return state
  }
}

export default unitOrigin

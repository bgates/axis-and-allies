import { COMMIT_UNITS, UNCOMMIT_UNITS, LOAD_TRANSPORT } from '../actions'

const add = (array = [], ids) => array.concat(ids)

const remove = (array, ids) => array.filter(id => !ids.includes(id))

const unitDestination = (state = {}, action) => {
  const { destinationIndex, unitIds } = action
  switch (action.type) {
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

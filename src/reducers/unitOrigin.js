import { COMMIT_UNITS, UNCOMMIT_UNITS } from '../actions'

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
  default:
    return state
  }
}

export default unitOrigin

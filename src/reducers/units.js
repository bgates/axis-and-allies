import { NEXT_TURN } from '../actions'
const units = (state = {}, action) => {
  if (action.type === NEXT_TURN) {
    return { ...state, ...action.newUnits }
  } else {
    return state
  }
}

export default units

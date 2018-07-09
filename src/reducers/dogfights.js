import { DOGFIGHT_OVER, NEXT_TURN } from '../actions'

const initialState = {}
const dogfights = (state = initialState, action) => {
  if (action.type === DOGFIGHT_OVER) {
    return { ...state, [action.territoryIndex]: true }
  } else if (action.type === NEXT_TURN) {
    return initialState
  } else {
    return state
  }
}
export default dogfights


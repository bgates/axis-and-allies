import { WIN_ATTACK, NEXT_TURN } from '../actions'

const initialState = {}
const conquered = (state = initialState, action) => {
  if (action.type === WIN_ATTACK && action.conqueringPower) {
    return { ...state, [action.territoryIndex]: true }
  } else if (action.type === NEXT_TURN) {
    return initialState
  } else {
    return state
  }
}
export default conquered

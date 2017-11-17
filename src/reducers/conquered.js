import { WIN_ATTACK, NEXT_TURN } from '../actions'

const conquered = (state = [], action) => {
  if (action.type === WIN_ATTACK && action.conqueringPower) {
    return [ ...state, action.territoryIndex ]
  } else if (action.type === NEXT_TURN) {
    return []
  } else {
    return state
  }
}
export default conquered

import { STRATEGIC_DOGFIGHT_OVER, NEXT_TURN } from '../actions'

const initialState = {}
const strategicDogfights = (state = initialState, action) => {
  if (action.type === STRATEGIC_DOGFIGHT_OVER) {
    return { ...state, [action.territoryIndex]: true }
  } else if (action.type === NEXT_TURN) {
    return initialState
  } else {
    return state
  }
}
export default strategicDogfights


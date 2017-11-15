import { COMBAT_UNDERWAY, NEXT_TURN } from '../actions'

const missionComplete = (state = {}, action) => {
  const { type, unitIds, bombardmentIds } = action
  switch (type) {
  case COMBAT_UNDERWAY: {
    let newState = { ...state };
    (bombardmentIds || []).forEach(id => newState[id] = true)
    return newState
  }
  case NEXT_TURN: {
    return {}
  }
  default:
    return state
  }
}

export default missionComplete


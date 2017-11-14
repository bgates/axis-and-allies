import { COMBAT_UNDERWAY } from '../actions'

const missionComplete = (state = {}, action) => {
  const { type, unitIds, bombardmentIds } = action
  switch (type) {
  case COMBAT_UNDERWAY: {
    const newState = { ...state }
    bombardmentIds.forEach(id => newState[id] = true)
    return newState
  }
  case 'end': {
    return {}
  }
  default:
    return state
  }
}

export default missionComplete


import { 
  REMOVE_FLAK_CASUALTIES, 
  COMBAT_UNDERWAY, 
  DOGFIGHT, 
  NEXT_TURN 
} from '../actions'

const reducer = (state = {}, action) => {
  const { type, territoryIndex } = action
  switch (type) {
    case REMOVE_FLAK_CASUALTIES: {
      return { ...state, [territoryIndex]: 'flak' }
    }
    case COMBAT_UNDERWAY: {
      if (state[territoryIndex] === 'dogfight') {
        return state
      } else {
        return { ...state, [territoryIndex]: 'combat' }
      }
    }
    case DOGFIGHT: {
      return { ...state, [territoryIndex]: 'dogfight' }
    }
    case NEXT_TURN: {
      return {}
    }
    default: {
      return state
    }
  }
}
export default reducer


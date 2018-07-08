import { omit } from 'ramda'
import { 
  REMOVE_FLAK_CASUALTIES, 
  DOGFIGHT, 
  VIEW_STRATEGIC_BOMBING_RESULTS,
  COMBAT_UNDERWAY, 
  WIN_ATTACK,
  LOSE_ATTACK,
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
    case VIEW_STRATEGIC_BOMBING_RESULTS:
      return omit([String(action.targetIndex)], state)
    case WIN_ATTACK:
    case LOSE_ATTACK: {
      return omit([String(territoryIndex)], state)
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


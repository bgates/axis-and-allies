import { omit } from 'ramda'
import { LOCATION_CHANGE } from 'connected-react-router'
import { 
  REMOVE_FLAK_CASUALTIES, 
  DOGFIGHT, 
  VIEW_STRATEGIC_BOMBING_RESULTS,
  COMBAT_UNDERWAY, 
  WIN_ATTACK,
  LOSE_ATTACK,
  NEXT_TURN 
} from '../actions'
import PATHS from '../paths'

const reducer = (state = {}, action) => {
  const { type, territoryIndex } = action
  switch (type) {
    case LOCATION_CHANGE: {
      const { pathname } = action.payload.location
      if (pathname === PATHS.COMBAT) {
        return Object.keys(state).reduce((newState, prop) => {
          const newValue = state[prop] === 'dogfight' ? 'postDogfight' : state[prop]
          return { ...newState, [prop]: newValue }
        }, {})
      } else {
        return state
      }
    }
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


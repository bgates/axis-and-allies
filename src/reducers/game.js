import { omit } from 'ramda';
import { 
  SET_GAME_ID,
  SET_LOGGED_IN_POWER,
  LOGOUT
} from '../actions'

export const game = (state = {}, action) => {
  switch(action.type) {
    case SET_GAME_ID:
      return { ...state, id: action.id }
    case SET_LOGGED_IN_POWER: 
      return { ...state, loggedInPower: action.power }
    case LOGOUT:
      return omit('loggedInPower', state)
    default:
      return state
  }
}

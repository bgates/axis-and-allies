import { 
  SET_GAME_ID,
  SET_USER_ID
} from '../actions'

export const game = (state = {}, action) => {
  switch(action.type) {
    case SET_GAME_ID:
      return { ...state, id: action.id }
    case SET_USER_ID: 
      return { ...state, userId: action.id }
    default:
      return state
  }
}

import { ROLLS, WIN_ATTACK, LOSE_ATTACK } from '../actions';

const rolls = (state = {}, action) => {
  switch (action.type) {
    case ROLLS:
      return { ...state, [action.phase]: action.rolls }
    case WIN_ATTACK:
      return { ...state, COMBAT_ROLLS: [] }
    case LOSE_ATTACK:
      return { ...state, COMBAT_ROLLS: [] }
    default:
      return state
  }
}
export default rolls

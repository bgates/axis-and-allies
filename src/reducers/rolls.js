import { ROLLS, WIN_ATTACK, LOSE_ATTACK } from '../actions';
import PATHS from '../paths';

const rolls = (state = {}, action) => {
  switch (action.type) {
    case ROLLS:
      return { ...state, [action.phase]: action.rolls }
    case WIN_ATTACK:
      return { ...state, [PATHS.COMBAT_ROLLS]: [] }
    case LOSE_ATTACK:
      return { ...state, [PATHS.COMBAT_ROLLS]: [] }
    default:
      return state
  }
}
export default rolls

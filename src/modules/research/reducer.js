import {
  SET_TECH,
  DEVELOP_TECH,
  INCREMENT_RESEARCH,
  DECREMENT_RESEARCH
} from '../../actions';

const research = (state = { attempts: 0 }, action) => {
  switch (action.type) {
    case SET_TECH:
      if (action.tech === state.selectedTech) {
        return state
      } else {
        return { selectedTech: action.tech, attempts: 0 }
      }
    case DEVELOP_TECH:
      return { ...state, developedTech: action.tech }
    case INCREMENT_RESEARCH:
      return { ...state, attempts: state.attempts + 1 }
    case DECREMENT_RESEARCH:
      return { ...state, attempts: state.attempts - 1 }
    default:
      return state
  }
}
export default research


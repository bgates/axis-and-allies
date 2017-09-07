import {
  SET_TECH,
  DEVELOP_TECH,
  INCREASE_RESEARCH_BUDGET,
  DECREASE_RESEARCH_BUDGET
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
    case INCREASE_RESEARCH_BUDGET:
      return { ...state, attempts: state.attempts + 1 }
    case DECREASE_RESEARCH_BUDGET:
      return { ...state, attempts: state.attempts - 1 }
    default:
      return state
  }
}
export default research


import {
  SET_TECH,
  DEVELOP_TECH,
  INCREASE_RESEARCH_BUDGET,
  DECREASE_RESEARCH_BUDGET,
  NEXT_TURN
} from '../../../../actions'

const origin = { attempts: 0 }

const research = (state = origin, action) => {
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
    case NEXT_TURN: 
      return origin
    default:
      return state
  }
}
export default research


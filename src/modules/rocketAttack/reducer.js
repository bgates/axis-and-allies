import { SET_ROCKET_TARGET, NEXT_TURN } from '../../actions'

const rocketTargets = (state = {}, action) => {
  switch (action.type) {
  case SET_ROCKET_TARGET: {
    return { ...state, [action.launchSite]: action.target }
  }
  case NEXT_TURN: {
    return {}
  }
  default:
      return state
  }
}
export default rocketTargets

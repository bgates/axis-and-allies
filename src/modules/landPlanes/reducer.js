import { SELECT_PLANE_LANDING_OPTION, NEXT_TURN } from '../../actions'

const origin = {}
const landPlanes = (state = origin, action) => {
  switch (action.type) {
    case SELECT_PLANE_LANDING_OPTION: {
      const { originIndex, destinationIndex, unit } = action;
      const unitString = `${unit.name}-${unit.originName}`
      const newState = Object.assign({}, state)
      newState[originIndex] = newState[originIndex] || {}
      const origin = newState[originIndex]
      return { ...state, [originIndex]: { ...origin, [unitString]: destinationIndex } }
    }
    case NEXT_TURN:
      return origin
    default:
      return state
  }
}

export default landPlanes
/* 
 * there's the territory I want to land in, the one I want to land from, and the unit; each of those are not strings.*/

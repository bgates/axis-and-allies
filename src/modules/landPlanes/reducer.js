import { SELECT_PLANE_LANDING_OPTION, NEXT_TURN } from '../../actions'

const origin = {}
const landPlanes = (state = origin, action) => {
  switch (action.type) {
    case SELECT_PLANE_LANDING_OPTION: {
      const { territoryIndex, unitId } = action;
      return { ...state, [unitId]: territoryIndex }
    }
    case NEXT_TURN:
      return origin
    default:
      return state
  }
}

export default landPlanes

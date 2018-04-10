import { REMOVE_FLAK_CASUALTIES, NEXT_TURN } from '../../actions'

const reducer = (state = {}, action) => {
  const { type, territoryIndex } = action
  switch (type) {
    case (REMOVE_FLAK_CASUALTIES): {
      return { ...state, [territoryIndex]: true }
    }
    case NEXT_TURN: {
      return {}
    }
    default: {
      return state
    }
  }
}
export default reducer

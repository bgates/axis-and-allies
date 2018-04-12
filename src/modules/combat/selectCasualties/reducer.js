import { TOGGLE_CASUALTY, REMOVE_CASUALTIES } from '../../../actions'

const casualties = (state = [], action) => {
  if (action.type === TOGGLE_CASUALTY) {
    const { id } = action
    if (state.includes(id)) {
      return state.filter(otherId => otherId !== id)
    } else {
      return state.concat(id)
    }
  } else if (action.type === REMOVE_CASUALTIES) {
    return []
  } else {
    return state
  }
}

export default casualties


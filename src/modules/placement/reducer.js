import {
  COMMIT_PLACEMENT,
  UNCOMMIT_PLACEMENT,
  COMMIT_PLACE_ALL,
  UNCOMMIT_PLACE_ALL,
  NEXT_TURN
} from '../../actions';

const placeUnit = (state, unitName, index, count = 1) => {
  const newState = JSON.parse(JSON.stringify(state));
  if (newState[unitName]) {
    if (newState[unitName][index]) {
      return { 
        ...newState, 
        [unitName]: {
          ...newState[unitName], 
          [index]: state[unitName][index] + count
        } 
      }
    } else {
      return {
        ...newState, 
        [unitName]: {
          ...newState[unitName], 
          [index]: count
        } 
      }
    }
  } else {
    return { ...newState, [unitName]: { [index]: count } }
  }
}

const origin = {}
const placement = (state = origin, action) => {
  switch (action.type) {
    case COMMIT_PLACEMENT: {
      return placeUnit(state, action.unit, action.territoryIndex)
    }
    case COMMIT_PLACE_ALL: {
      return placeUnit(state, action.unit, action.territoryIndex, action.count)
    }
    case UNCOMMIT_PLACEMENT: {
      const newState = JSON.parse(JSON.stringify(state));
      const unitName = action.unit;
      const territoryIndex = action.territoryIndex;
      return { 
        ...newState, 
        [unitName]: {
          ...newState[unitName],
          [territoryIndex]: newState[unitName][territoryIndex] - 1
        }
      }
    }
    case UNCOMMIT_PLACE_ALL: {
      const newState = JSON.parse(JSON.stringify(state));
      const unitName = action.unit;
      const territoryIndex = action.territoryIndex;
      return { 
        ...newState, 
        [unitName]: {
          ...newState[unitName],
          [territoryIndex]: 0
        }
      }
    }
    case NEXT_TURN: 
      return origin
    default:
      return state
  }
}
export default placement


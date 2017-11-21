import { omit } from 'ramda'
import { 
  INCREMENT_PURCHASE, 
  DECREMENT_PURCHASE, 
  NEXT_TURN 
} from '../../actions'
  
const origin = {}

const purchases = (state = origin, action) => {
  const { type, unit } = action
  switch (type) {
    case INCREMENT_PURCHASE: {
      const unitName = unit.name
      if (state[unitName]) {
        return { ...state, [unitName]: state[unitName] + 1}
      } else {
        return { ...state, [unitName]: 1 }
      }
    }
    case DECREMENT_PURCHASE: {
      const unitName = unit.name
      if (state[unitName] === 1) {
        return omit(unitName, state)
      } else {
        return { ...state, [unitName]: state[unitName] - 1 }
      }
    }
    case NEXT_TURN:
      return origin
    default:
      return state
  }
}
export default purchases


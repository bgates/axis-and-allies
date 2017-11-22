import { SET_INCOME, NEXT_TURN } from '../../actions'

const income = (state = 0, action) => {
  switch (action.type) {
    case SET_INCOME: {
      return action.amount
    }
    case NEXT_TURN: {
      return 0
    }
    default: 
      return state
  }
}

export default income

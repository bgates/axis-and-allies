import { SET_INCOME } from '../../actions'

const income = (state = 0, action) => {
  switch (action.type) {
    case '@@router/LOCATION_CHANGE': 
      const { pathname } = action.payload.location
      if (pathname === '/confirm-finish') {
        return 0
      } else {
        return state
      }
    case SET_INCOME: {
      return action.amount
    }
    default: 
      return state
  }
}

export default income

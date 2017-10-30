import { currentPowerNPL } from './selectors'

const income = (state = 0, action) => {
  switch (action.type) {
    case '@@router/LOCATION_CHANGE': 
      const { pathname } = action.payload.location
      if (pathname === '/income' && !state) {
        return currentPowerNPL(state)
      } else if (pathname === '/confirm-finish') {
        return 0
      } else {
        return state
      }
    default: 
      return state
  }
}

export default income

import { currentPowerNPL } from '../../income';

const incomeHelper = (state, action) => {
  switch (action.type) {
    case '@@router/LOCATION_CHANGE': 
      const { pathname } = action.payload.location;
      if (pathname === '/income' && !state.currentPowerIncome) {
        return currentPowerNPL({ board: state })
      } else if (pathname === '/accrue-income') {
        return 0
      } else {
        return state.currentPowerIncome
      }
    default: 
      return state.currentPowerIncome
  }
}

export default incomeHelper


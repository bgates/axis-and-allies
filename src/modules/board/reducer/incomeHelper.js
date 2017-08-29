const incomeHelper = (state, action) => {
  switch (action.type) {
    case 'INCOME':
      return state.currentPowerIncome
    default: 
      return state.currentPowerIncome
  }
}

export default incomeHelper


import {
  ATTEMPT_RESEARCH,
  DEVELOP_TECH,
  INCREMENT_PURCHASE,
  DECREMENT_PURCHASE,
  VIEW_STRATEGIC_BOMBING_RESULTS
} from '../../../actions'

const updateCurrentPower = (powers, cPI, updateCallback, callbackArg) => (
  powers.map((power, i) => i === cPI ? updateCallback(power, callbackArg) : power)
)

const spendIPCs = (power, amount) => (
  { ...power, ipc: power.ipc - amount }
)

const gainIPCs = (power, amount) => (
  { ...power, ipc: power.ipc +  amount }
)

const powers = (state, action) => {
  const { currentPowerIndex } = state
  switch (action.type) {
    case '@@router/LOCATION_CHANGE': 
      const { pathname } = action.payload.location;
      if (pathname === '/confirm-finish') {
        return updateCurrentPower(state.powers, currentPowerIndex, gainIPCs, state.currentPowerIncome)
      } else {
        return state.powers
      }
    case VIEW_STRATEGIC_BOMBING_RESULTS: {
      let powers = state.powers 
      return powers.map(power => {
        if (power.name === action.power) {
          return spendIPCs(power, action.damage)
        } else {
          return power
        }
      })
    }
    case DEVELOP_TECH:
      const assignTech = (power) => {
        return { ...power, tech: power.tech.concat(action.tech) }
      }
      return updateCurrentPower(state.powers, currentPowerIndex, assignTech)
    case ATTEMPT_RESEARCH:
      return updateCurrentPower(state.powers, currentPowerIndex, spendIPCs, action.cost)
    case INCREMENT_PURCHASE:
      return updateCurrentPower(state.powers, currentPowerIndex, spendIPCs, action.unit.cost)
    case DECREMENT_PURCHASE:
      return updateCurrentPower(state.powers, currentPowerIndex, gainIPCs, action.unit.cost)
    default:
      return state.powers
  }
}

export default powers


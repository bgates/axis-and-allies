import initialPowers from '../config/initialPowers'
import {
  ATTEMPT_RESEARCH,
  DEVELOP_TECH,
  INCREMENT_PURCHASE,
  DECREMENT_PURCHASE,
  VIEW_STRATEGIC_BOMBING_RESULTS,
  ASSESS_ROCKET_DAMAGE
} from '../actions'

const updateCurrentPower = (powers, cPI, updateCallback, callbackArg) => (
  powers.map((power, i) => i === cPI ? updateCallback(power, callbackArg) : power)
)

const spendIPCs = (power, amount) => (
  { ...power, ipc: power.ipc - amount }
)

const gainIPCs = (power, amount) => (
  { ...power, ipc: power.ipc +  amount }
)

const powers = (state = initialPowers, action) => {
  const { currentPowerIndex } = action //state
  switch (action.type) {
    case '@@router/LOCATION_CHANGE': 
      const { pathname } = action.payload.location
      if (pathname === '/confirm-finish') {
        //TODO: how to get CPI in here?
        return updateCurrentPower(state, currentPowerIndex, gainIPCs, state.currentPowerIncome)
      } else {
        return state
      }
    case VIEW_STRATEGIC_BOMBING_RESULTS: {
      return state.map(power => {
        if (power.name === action.power) {
          return spendIPCs(power, action.damage)
        } else {
          return power
        }
      })
    }
    case ASSESS_ROCKET_DAMAGE: {
      return state.map(power => {
        if (action.damages[power.name]) {
          return spendIPCs(power, action.damages[power.name])
        } else {
          return power
        }
      })
    }
    case DEVELOP_TECH:
      const assignTech = (power) => {
        return { ...power, tech: power.tech.concat(action.tech) }
      }
      return updateCurrentPower(state, currentPowerIndex, assignTech)
    case ATTEMPT_RESEARCH:
      return updateCurrentPower(state, currentPowerIndex, spendIPCs, action.cost)
    case INCREMENT_PURCHASE:
      return updateCurrentPower(state, currentPowerIndex, spendIPCs, action.unit.cost)
    case DECREMENT_PURCHASE:
      return updateCurrentPower(state, currentPowerIndex, gainIPCs, action.unit.cost)
    default:
      return state
  }
}

export default powers



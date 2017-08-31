import { omit } from 'ramda';
import {
  ATTEMPT_RESEARCH,
  DEVELOP_TECH,
  INCREMENT_PURCHASE,
  DECREMENT_PURCHASE,
  NEXT_TURN
} from '../../../actions';

const updateObject = (object, newValues) => {
  return Object.assign({}, object, newValues)
}

const updateCurrentPower = (powers, updateCallback, callbackArg) => {
  return powers.map(power => power.current ? updateCallback(power, callbackArg) : power)
}

const spendIPCs = (power, amount) => {
  return updateObject(power, { ipc: power.ipc - amount })
}

const gainIPCs = (power, amount) => {
  return updateObject(power, { ipc: power.ipc +  amount })
}

const powers = (state, action) => {
  switch (action.type) {
    case '@@router/LOCATION_CHANGE': 
      const { pathname } = action.payload.location;
      if (pathname === '/confirm-finish') {
        return updateCurrentPower(state.powers, gainIPCs, state.currentPowerIncome)
      } else {
        return state.powers
      }
    case NEXT_TURN:
      let powers = state.powers
      const currentPower = powers.find(power => power.current)
      const nextPowerIndex = currentPower.name === 'China' ? 0 : powers.indexOf(currentPower) + 1
      return powers.map((power, n) => {
        if(power.current) {
          return omit('current', power) 
        } else if (n === nextPowerIndex) {
          return {...power, current: true}
        } else {
          return power
        }
      })
    case DEVELOP_TECH:
      const assignTech = (power) => {
        return updateObject(power, { tech: power.tech.concat(action.tech) })
      }
      return updateCurrentPower(state.powers, assignTech)
    case ATTEMPT_RESEARCH:
      return updateCurrentPower(state.powers, spendIPCs, action.cost)
    case INCREMENT_PURCHASE:
      return updateCurrentPower(state.powers, spendIPCs, action.unit.cost)
    case DECREMENT_PURCHASE:
      return updateCurrentPower(state.powers, gainIPCs, action.unit.cost)
    default:
      return state.powers
  }
}

export default powers


import initialPowers from '../../config/initialPowers';
import { omit } from 'ramda';

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

const powers = (state = initialPowers, action) => {
  switch (action.type) {
    case 'NEXT_TURN':
      const currentPower = state.find(power => power.current)
      const nextPowerIndex = currentPower.name === 'China' ? 0 : state.indexOf(currentPower) + 1
      return state.map((power, n) => {
        if(power.current) {
          return omit('current', power) 
        } else if (n === nextPowerIndex) {
          return {...power, current: true}
        } else {
          return power
        }
      })
    case 'DEVELOP_TECH':
      const assignTech = (power) => {
        return updateObject(power, { tech: power.tech.concat(action.tech) })
      }
      return updateCurrentPower(state, assignTech)
    case 'ATTEMPT_RESEARCH':
      return updateCurrentPower(state, spendIPCs, action.cost)
    case 'INCREMENT_PURCHASE':
      return updateCurrentPower(state, spendIPCs, action.unit.cost)
    case 'DECREMENT_PURCHASE':
      return updateCurrentPower(state, gainIPCs, action.unit.cost)
    default:
      return state
  }
}

export default powers


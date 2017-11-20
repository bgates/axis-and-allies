import { omit } from 'ramda'
import { 
  COMMIT_UNITS, 
  COMMIT_TO_STRATEGIC_BOMBING,
  UNCOMMIT_UNITS, 
  REMOVE_CASUALTIES,
  WIN_ATTACK,
  NEXT_TURN 
} from '../actions'

const flightDistance = (state = {}, action) => {
  const { type, casualties, unitIds, attackerCasualties, distance } = action
  switch (type) {
  case COMMIT_TO_STRATEGIC_BOMBING:
  case COMMIT_UNITS: {
    let newState = { ...state }
    if (distance) {
      unitIds.forEach(id => newState[id] = distance)
    }
    return newState
  }
  case UNCOMMIT_UNITS: {
    return omit(unitIds.map(String), state)
  }
  case REMOVE_CASUALTIES: {
    return omit(attackerCasualties.map(String), state)
  }
  case WIN_ATTACK: {
    return omit(casualties.map(String), state)
  }
  case NEXT_TURN: {
    return {}
  }
  default:
    return state
  }
}

export default flightDistance


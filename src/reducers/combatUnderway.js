import { COMBAT_UNDERWAY, NEXT_TURN } from '../actions'

const combatUnderway = (state = [], action) => {
  const { type, territoryIndex } = action
  if (type === COMBAT_UNDERWAY) {
    return state.concat(territoryIndex)
  } else if (type === NEXT_TURN) {
    return []
  } else {
    return state
  }
}
export default combatUnderway

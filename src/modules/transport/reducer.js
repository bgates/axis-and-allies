import { omit } from 'ramda'
import {
  COMMIT_AMPHIB_UNITS, UNCOMMIT_AMPHIB_UNITS, COMBAT_UNDERWAY
} from '../../actions'

const amphib = (state = { transport: {}, territory: {} }, action) => {
  const { transportId, targetIndex, type } = action
  const { transport, territory } = state
  switch (type) {
    case COMMIT_AMPHIB_UNITS: {
      return { 
        transport: { ...transport, [transportId]: targetIndex }, 
        territory: { ...territory, [targetIndex]: (territory[targetIndex] || []).concat(transportId) }
      }
    }
    case UNCOMMIT_AMPHIB_UNITS: {
      return {
        transport: omit(String(transportId), transport),
        territory: { ...territory, [targetIndex]: territory[targetIndex].filter(id => id !== transportId) }
      }
    }
    case COMBAT_UNDERWAY: {
      return {
        transport,
        territory: omit(String(action.territoryIndex), territory)
      }
    }
    default:
      return state
  }
}

export default amphib

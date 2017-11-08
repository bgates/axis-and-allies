import { omit } from 'ramda'
import {
  COMMIT_AMPHIB_UNITS, UNCOMMIT_AMPHIB_UNITS
} from '../../actions'

const amphib = (state = { transport: {}, territory: {} }, action) => {
  const { transportId, destinationIndex, type } = action
  const { transport, territory } = state
  switch (type) {
    case COMMIT_AMPHIB_UNITS: {
      return { 
        transport: { ...transport, [transportId]: destinationIndex }, 
        territory: { ...territory, [destinationIndex]: (territory[destinationIndex] || []).concat(transportId) }
      }
    }
    case UNCOMMIT_AMPHIB_UNITS: {
      return {
        transport: omit(String(transportId), transport),
        territory: { ...territory, [destinationIndex]: territory[destinationIndex].filter(id => id !== transportId) }
      }
    }
    default:
      return state
  }
}

export default amphib

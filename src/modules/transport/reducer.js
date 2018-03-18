// @flow
import { omit } from 'ramda'
import {
  COMMIT_AMPHIB_UNITS, UNCOMMIT_AMPHIB_UNITS, COMBAT_UNDERWAY
} from '../../actions'
import type { Action } from '../../actions/types'

type State = {
  transport: { string?: number },
  territory: { string?: number[] }
}

const amphib = (state: State = { transport: {}, territory: {} }, action: Action) => {
  const { type } = action
  const { transport, territory } = state
  switch (type) {
    case COMMIT_AMPHIB_UNITS: {
      const { transportId, targetIndex } = action
      return { 
        transport: { ...transport, [transportId]: targetIndex }, 
        territory: { ...territory, [targetIndex]: (territory[targetIndex] || []).concat(transportId) }
      }
    }
    case UNCOMMIT_AMPHIB_UNITS: {
      const { transportId, targetIndex } = action
      return {
        transport: omit([String(transportId)], transport),
        territory: { ...territory, [targetIndex]: territory[targetIndex].filter(id => id !== transportId) }
      }
    }
    case COMBAT_UNDERWAY: {
      return {
        transport,
        territory: omit([String(action.territoryIndex)], territory)
      }
    }
    default:
      return state
  }
}

export default amphib

// @flow
import { omit } from 'ramda'
import { 
  COMMIT_BOMBARDMENT_UNITS, 
  UNCOMMIT_BOMBARDMENT_UNITS 
} from '../../actions'
import { add, remove } from '../../reducers/unitOrigin'
import type { Action } from '../../actions/types'

type State = {
  bombardingUnits: { [string]: Array<number> },
  targetTerritories: { [string]: Array<number> }
}

const initialState = {
  bombardingUnits: {},
  targetTerritories: {}
}

const bombardment = (state:State = initialState, action:Action) => {
  switch (action.type) {
  case COMMIT_BOMBARDMENT_UNITS: {
    const { unitIds, targetIndex } = action
    const index = targetIndex.toString()
    let { bombardingUnits, targetTerritories } = { ...state }
    // unitIds.forEach(id => bombardingUnits[id.toString()] = targetIndex)
    targetTerritories[index] = add(targetTerritories[index], unitIds)
    return { bombardingUnits, targetTerritories }
  }
  case UNCOMMIT_BOMBARDMENT_UNITS: {
    const { unitIds, targetIndex } = action
    const index = targetIndex.toString()
    const { bombardingUnits, targetTerritories } = { ...state }
    return { 
      bombardingUnits: omit(unitIds.map(String), bombardingUnits),
      targetTerritories: { 
        ...targetTerritories, 
        [index]: remove(targetTerritories[index], unitIds)
      }
    }
  }
  default:
    return state
  }
}

export default bombardment


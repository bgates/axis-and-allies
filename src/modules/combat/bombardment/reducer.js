// @flow
import { omit } from 'ramda'
import { 
  COMMIT_BOMBARDMENT_UNITS, 
  UNCOMMIT_BOMBARDMENT_UNITS 
} from '../../actions'
import { add, remove } from '../../reducers/unitOrigin'
import type { Action } from '../../actions/types'

type State = {
  bombardingUnits: { [string]: number },
  targetTerritories: { [string]: number[] }
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
    const { bombardingUnits, targetTerritories } = state
    let newBombardingUnits = { ...bombardingUnits }
    let newTargetTerritories = { ...targetTerritories }
    unitIds.forEach(id => newBombardingUnits[id.toString()] = targetIndex)
    newTargetTerritories[index] = add(newTargetTerritories[index], unitIds)
    return { bombardingUnits: newBombardingUnits, targetTerritories: newTargetTerritories }
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


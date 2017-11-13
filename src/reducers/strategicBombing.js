import { omit } from 'ramda'
import { COMMIT_TO_STRATEGIC_BOMBING, UNCOMMIT_UNITS } from '../actions'
import { add, remove } from './unitOrigin'

const strategicBombing = (state = { bombingUnits: {}, targetTerritories: {} }, action) => {
  switch (action.type) {
  case COMMIT_TO_STRATEGIC_BOMBING: {
    const { unitIds, targetIndex } = action
    let { bombingUnits, targetTerritories } = { ...state }
    unitIds.forEach(id => bombingUnits[id] = targetIndex)
    targetTerritories[targetIndex] = add(targetTerritories[targetIndex], unitIds)
    return { bombingUnits, targetTerritories }
  }
  case UNCOMMIT_UNITS: {
    const { unitIds, targetIndex } = action
    const { bombingUnits, targetTerritories } = { ...state }
    return { 
      bombingUnits: omit(unitIds.map(String), bombingUnits),
      targetTerritories: { 
        ...targetTerritories, 
        [targetIndex]: remove(targetTerritories[targetIndex], unitIds)
      }
    }
  }
  default:
    return state
  }
}

export default strategicBombing


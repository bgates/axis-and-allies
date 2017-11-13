import { omit } from 'ramda'
import { 
  COMMIT_BOMBARDMENT_UNITS, 
  UNCOMMIT_BOMBARDMENT_UNITS 
} from '../../actions'
import { add, remove } from '../../reducers/unitOrigin'

const bombardment = (state = { bombardingUnits: {}, targetTerritories: {} }, action) => {
  const { unitIds, targetIndex, type } = action
  switch (type) {
  case COMMIT_BOMBARDMENT_UNITS: {
    let { bombardingUnits, targetTerritories } = { ...state }
    unitIds.forEach(id => bombardingUnits[id] = targetIndex)
    targetTerritories[targetIndex] = add(targetTerritories[targetIndex], unitIds)
    return { bombardingUnits, targetTerritories }
  }
  case UNCOMMIT_BOMBARDMENT_UNITS: {
    const { bombardingUnits, targetTerritories } = { ...state }
    return { 
      bombardingUnits: omit(unitIds.map(String), bombardingUnits),
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

export default bombardment


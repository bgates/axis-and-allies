import { omit } from 'ramda'
import { 
  COMMIT_TO_STRATEGIC_BOMBING, 
  UNCOMMIT_UNITS,
  REMOVE_FLAK_CASUALTIES,
  REMOVE_CASUALTIES,
  LOSE_ATTACK,
  VIEW_STRATEGIC_BOMBING_RESULTS
} from '../../../actions'
import { add, remove } from '../../../reducers/unitOrigin'

const strategicBombing = (state = { bombingUnits: {}, targetTerritories: {} }, action) => {
  const { unitIds, targetIndex, type } = action
  switch (type) {
  case COMMIT_TO_STRATEGIC_BOMBING: {
    let { bombingUnits, targetTerritories } = { ...state }
    unitIds.forEach(id => bombingUnits[id] = targetIndex)
    targetTerritories[targetIndex] = add(targetTerritories[targetIndex], unitIds)
    return { bombingUnits, targetTerritories }
  }
  case UNCOMMIT_UNITS: {
    const { bombingUnits, targetTerritories } = { ...state }
    return { 
      bombingUnits: omit(unitIds.map(String), bombingUnits),
      targetTerritories: { 
        ...targetTerritories, 
        [targetIndex]: remove(targetTerritories[targetIndex], unitIds)
      }
    }
  }
  case REMOVE_CASUALTIES:
  case REMOVE_FLAK_CASUALTIES: {
    let { bombingUnits, targetTerritories } = { ...state }
    const { attackerCasualties, territoryIndex } = action
    const target = targetTerritories[territoryIndex]
    if (target) {
      if (target.every(id => attackerCasualties.includes(id))) {
        return {
          bombingUnits: omit(attackerCasualties.map(String), bombingUnits),
          targetTerritories: omit([territoryIndex], targetTerritories)
        }
      } else {
        return {
          bombingUnits: omit(attackerCasualties.map(String), bombingUnits),
          targetTerritories: {
            ...targetTerritories,
            [territoryIndex]: remove(target, attackerCasualties)
          }
        }
      }
    } else {
      return state
    }
  }
  case LOSE_ATTACK: {
    let { bombingUnits, targetTerritories } = { ...state }
    const { attackerCasualties, territoryIndex } = action
    return {
      bombingUnits: omit(attackerCasualties.map(String), bombingUnits),
      targetTerritories: {
        ...targetTerritories,
        [territoryIndex]: remove(targetTerritories[territoryIndex], attackerCasualties)
      }
    }
  }
  case VIEW_STRATEGIC_BOMBING_RESULTS: {
    const { bombingUnits, targetTerritories } = { ...state }
    const { targetIndex } = action
    return {
      bombingUnits: omit(targetTerritories[targetIndex].map(String), bombingUnits),
      targetTerritories: omit([String(targetIndex)], targetTerritories)
    }
  }
  default:
    return state
  }
}

export default strategicBombing


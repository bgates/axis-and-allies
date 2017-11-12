import { 
  COMBAT_UNDERWAY,
  REMOVE_CASUALTIES, 
  WIN_ATTACK
} from '../actions'

const mapping = (territoryIndex, callback) => (territory, index) => (
  index === territoryIndex ? callback(territory) : territory
)

const territories = (state = [], action) => {
  const { type, territoryIndex } = action
  switch (type) {
  case '@@router/LOCATION_CHANGE': {
    return state
  }
  case COMBAT_UNDERWAY: {
    return state.map(mapping(territoryIndex, t => ({ ...t, unitIds: t.unitIds.concat(action.unitIds) })))
  }
  case REMOVE_CASUALTIES: {
    const { attackerCasualties, defenderCasualties } = action
    const casualties = attackerCasualties.concat(defenderCasualties)
    return state.map(mapping(territoryIndex, t => ({ ...t, unitIds: t.unitIds.filter(id => !casualties.includes(id)) }))) 
  }
  case WIN_ATTACK: {
    const { conqueringPower, defenderIds, casualties } = action
    const callback = territory => {
      const currentPower = conqueringPower || territory.currentPower
      const unitIds = territory.unitIds.filter(id => !defenderIds.concat(casualties).includes(id))
      return { ...territory, currentPower, unitIds }
    }
    return state.map(mapping(territoryIndex, callback))
  }
  default:
    return state
  }
}

export default territories


import { REMOVE_CASUALTIES, COMBAT_UNDERWAY } from '../actions'

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
  default:
    return state
  }
}

export default territories


import { 
  COMBAT_UNDERWAY,
  REMOVE_CASUALTIES, 
  WIN_ATTACK,
  LOSE_ATTACK,
  NEXT_TURN
} from '../actions'

const mapping = (territoryIndex, callback) => (territory, index) => (
  index === territoryIndex ? callback(territory) : territory
)

const territories = (state = [], action) => {
  const { type, territoryIndex } = action
  switch (type) {
  case COMBAT_UNDERWAY: {
    return state.map(mapping(territoryIndex, t => ({ ...t, unitIds: t.unitIds.concat(action.unitIds) })))
  }
  case LOSE_ATTACK:
  case REMOVE_CASUALTIES: {
    const { attackerCasualties, defenderCasualties } = action
    const casualties = attackerCasualties.concat(defenderCasualties)
    return state.map(mapping(territoryIndex, t => ({ ...t, unitIds: t.unitIds.filter(id => !casualties.includes(id)) }))) 
  }
  case WIN_ATTACK: {
    const { conqueringPower, attackerIds, airUnits, casualties } = action
    const callback = territory => {
      const currentPower = conqueringPower || territory.currentPower
      const unitIds = attackerIds.filter(id => !casualties.includes(id) && !airUnits[id])
      return { ...territory, currentPower, unitIds }
    }
    return state.map(mapping(territoryIndex, callback))
  }
  //TODO: this doesn't take plane landing into account
  case NEXT_TURN: {
    const { unitOrigin, unitDestination, idsByTerritoryIndex } = action
    return state.map((territory, index) => {
      const outboundUnits = unitOrigin[index] || []
      const inboundUnits = unitDestination[index] || []
      const newUnits = idsByTerritoryIndex[index] || []
      const unitIds = territory.unitIds
                        .filter(id => !outboundUnits.includes(id))
                        .concat(inboundUnits)
                        .concat(newUnits)
      return { ...territory, unitIds }
    })
  }
  default:
    return state
  }
}

export default territories

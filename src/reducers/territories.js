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
    const { combatUnderway, bombardmentIds } = action
    return state.map(mapping(territoryIndex, t => {
      let unitIds = t.unitIds.concat(action.unitIds)
      unitIds = combatUnderway ? unitIds.filter(id => !bombardmentIds.includes(id)) : unitIds.concat(bombardmentIds)
      return { ...t, unitIds }
    }))
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
  case NEXT_TURN: {
    const { unitOrigin, unitDestination, idsByTerritoryIndex, landPlanes } = action
    return state.map((territory, index) => {
      const outboundUnits = unitOrigin[index] || []
      const inboundUnits = unitDestination[index] || []
      const newUnits = idsByTerritoryIndex[index] || []
      const landingUnits = Object.keys(landPlanes).filter(id => landPlanes[id] === index)
      const unitIds = territory.unitIds
                        .filter(id => !outboundUnits.includes(id))
                        .concat(inboundUnits.filter(id => !landPlanes[id]))
                        .concat(landingUnits)
                        .concat(newUnits)
      return { ...territory, unitIds }
    })
  }
  default:
    return state
  }
}

export default territories

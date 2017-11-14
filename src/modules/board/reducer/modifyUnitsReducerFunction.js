import { unitCount } from '../../../lib/unit'

const count = (units, name) => (  
  units.reduce((total, unit) => total + (unit.name === name ? unitCount(unit) : 0), 0)
)

const changeTerritory = (territories, territoryIndex, callback) => (
  territories.map((territory, index) => (
    index === territoryIndex ? callback(territory) : territory
  ))
)

export const dogfight = (state, action) => {
  const callback = territory => ({ ...territory, dogfight: true })    
  return changeTerritory(state.territories, action.territory.index, callback)
}


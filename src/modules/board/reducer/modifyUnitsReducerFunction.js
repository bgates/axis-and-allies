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

const bombardingTerritory = (territory, targetIndex, ids) => {
  let unit = territory.units.find(u => u.ids.includes(ids[0]))
  if (unit) {
    let bombard = unit.bombard || {}
    ids.forEach(id => bombard[id] = targetIndex)
    const units = territory.units
      .filter(u => u !== unit).concat({ ...unit, bombard })
    return { ...territory, units }
  } else {
    unit = territory.unitsFrom.find(u => u.ids.includes(ids[0]))
    let bombard = unit.bombard || {}
    ids.forEach(id => bombard[id] = targetIndex)
    const unitsFrom = territory.unitsFrom
      .filter(u => u !== unit).concat({ ...unit, bombard })
    return { ...territory, unitsFrom }
  }
}

const bombardedTerritory = (territory, locationIndex, ids) => {
  let bombard = territory.bombard || {}
  bombard[locationIndex] = bombard[locationIndex] || []
  bombard[locationIndex] = bombard[locationIndex].concat(ids)
  return { ...territory, bombard }
}

export const commitBombardmentUnits = (state, action) => {
  const { targetIndex, locationIndex, ids } = action
  return state.territories.map((territory, index) => {
    if (index === locationIndex) {
      return bombardingTerritory(territory, targetIndex, ids)
    } else if (index === targetIndex) {
      return bombardedTerritory(territory, locationIndex, ids)
    } else {
      return territory
    }
  })
}

const territoryWithoutBombarding = (territory, targetIndex, ids) => {
  let unit = territory.units.find(u => u.ids.includes(ids[0]))
  if (unit) {
    let { bombard } = unit
    ids.forEach(id => delete bombard[id])
    const units = territory.units
      .filter(u => u !== unit).concat({ ...unit, bombard })
    return { ...territory, units }
  } else {
    unit = territory.unitsFrom.find(u => u.ids.includes(ids[0]))
    let { bombard } = unit
    ids.forEach(id => delete bombard[id])
    const unitsFrom = territory.unitsFrom
      .filter(u => u !== unit).concat({ ...unit, bombard })
    return { ...territory, unitsFrom }
  }
}

export const uncommitBombardmentUnits = (state, action) => {
  const { targetIndex, locationIndex, ids } = action
  return state.territories.map((territory, index) => {
    if (index === locationIndex) {
      return territoryWithoutBombarding(territory, targetIndex, ids)
    } else if (index === targetIndex) {
      let { bombard } = territory
      bombard[locationIndex] = bombard[locationIndex]
        .filter(id => !ids.includes(id))
      return { ...territory, bombard }
    } else {
      return territory
    }
  })
}

export const continueCombat = (state, action) => {
  const callback = territory => ({ ...territory, continueCombat: true })
  return changeTerritory(state.territories, action.territory.index, callback)
}

export const clearUnits = (state, action) => (  
  state.territories.map(territory => (
    territory.units ? { ...territory, units: territory.units.filter(unitCount) } : territory
  ))
)

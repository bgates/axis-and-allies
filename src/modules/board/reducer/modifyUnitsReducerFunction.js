import { unitCount } from '../../../lib/unit'

const count = (units, name) => (  
  units.reduce((total, unit) => total + (unit.name === name ? unitCount(unit) : 0), 0)
)

const modify = (units) => {
  let newUnits = JSON.parse(JSON.stringify(units))
  const supportable = Math.min(count(units, 'artillery'), count(units, 'infantry'))
  if (supportable) {
    newUnits = newUnits.map(u => u.name === 'infantry' ? { ...u, attack: 1 } : u)
    let supportedCount = 0
    let supportedInfantry = []
    while (supportedCount < supportable) {
      let countToBeSupported = supportable - supportedCount
      let infantry = newUnits.find(u => u.name === 'infantry' && u.attack === 1)
      newUnits = newUnits.filter(u => u !== infantry)
      if (unitCount(infantry) <= countToBeSupported) {
        supportedInfantry = supportedInfantry.concat({ ...infantry, attack: 2 })
        supportedCount += unitCount(infantry)
      } else {
        const supportedIds = infantry.ids.slice(0, countToBeSupported)
        const unsupportedIds = infantry.ids.slice(countToBeSupported)
        const supported = { ...infantry, attack: 2, ids: supportedIds }
        const unsupported = { ...infantry, ids: unsupportedIds }
        supportedInfantry = supportedInfantry.concat(supported).concat(unsupported)
        supportedCount += unitCount(supported)
      }
    }
    newUnits = [ ...supportedInfantry, ...newUnits ]
  }
  return newUnits
}

const changeTerritory = (territories, territoryIndex, callback) => (
  territories.map((territory, index) => (
    index === territoryIndex ? callback(territory) : territory
  ))
)

export const modifyUnits = (state, action) => {
  const callback = territory => ({ ...territory, unitsFrom: modify(territory.unitsFrom) })
  return changeTerritory(state.territories, action.territory.index, callback)
}

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

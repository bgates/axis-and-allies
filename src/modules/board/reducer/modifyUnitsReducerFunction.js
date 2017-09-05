const count = (units, name) => (  
  units.reduce((total, unit) => total + (unit.name === name ? unit.ids.length : 0), 0)
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
      if (infantry.ids.length <= countToBeSupported) {
        supportedInfantry = supportedInfantry.concat({ ...infantry, attack: 2 })
        supportedCount += infantry.ids.length
      } else {
        const supportedIds = infantry.ids.slice(0, countToBeSupported)
        const unsupportedIds = infantry.ids.slice(countToBeSupported)
        const supported = { ...infantry, attack: 2, ids: supportedIds }
        const unsupported = { ...infantry, ids: unsupportedIds }
        supportedInfantry = supportedInfantry.concat(supported).concat(unsupported)
        supportedCount += supported.ids.length
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

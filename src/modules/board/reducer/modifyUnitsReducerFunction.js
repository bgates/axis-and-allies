const count = (units, name) => (  
  units.reduce((total, unit) => total + (unit.name === name ? unit.ids.length : 0), 0)
)

const modify = (units) => {
  let newUnits = units
  const artilleryCount = count(units, 'artillery')
  const infantryCount = count(units, 'infantry')
  if (infantryCount > artilleryCount) {
    const infantry = units.filter(u => u.name === 'infantry')
    const supportedIds = infantry.ids.slice(0, artilleryCount)
    const unsupportedIds = infantry.ids.slice(artilleryCount)
    const supported = { ...infantry, attack: 2, ids: supportedIds }
    const unsupported = { ...infantry, ids: unsupportedIds }
    newUnits = [ unsupported, supported, ...units.filter(u => u !== infantry) ]
  } else if (artilleryCount) {
    newUnits = units.map(u => u.name === 'infantry' ? { ...u, attack: 2 } : u)
  }
  console.log(newUnits)
  return newUnits
}

export const modifyUnits = (state, action) => {
  const territoryIndex = action.territory.index;
  return state.territories.map((territory, index) => {
    if (index === territoryIndex) {
      return { ...territory, unitsFrom: modify(territory.unitsFrom) }
    } else {
      return territory
    }
  })
}

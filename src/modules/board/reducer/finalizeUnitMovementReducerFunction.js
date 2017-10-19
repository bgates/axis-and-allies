import { unitMatch, unitCount } from '../../../lib/unit'

export const finalizeUnitMovements = state => {
  return state.territories.map(territory => {
    if (territory.unitsFrom && territory.unitsFrom.length) {
      let units
      if (territory.units && territory.units.length) {
        // go through the units and if there is a match, add matcher ids into matched ids
        const { unitsFrom } = territory
        units = territory.units.map(unit => {
          let unitFrom = unitsFrom.find(u => unitMatch(unit, u, 'power'))
          return unitFrom ? { ...unit, ids: unit.ids.concat(unitFrom.ids) } : unit
        })
        unitsFrom.forEach(unitFrom => {
          let unit = units.find(u => unitMatch(u, unitFrom, 'power'))
          if (!unit) {
            units = [ ...units, unitFrom ]
          }
        })
      } else {
        units = territory.unitsFrom.filter(unitCount)
      }
      return { ...territory, units, unitsFrom: [] }
    } else {
      return { ...territory, units: territory.units.filter(unitCount) }
    }
  })
}


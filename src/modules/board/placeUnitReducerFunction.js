import { id } from '../../lib/unit'
import unitTypes from '../../config/unitTypes'

export const placeUnits = (state, action) => {
  const { placements, currentPower } = action;
  const placementsByTerritoryIndex = {};
  Object.keys(placements).forEach(unit => {
    Object.keys(placements[unit]).forEach(index => {
      placementsByTerritoryIndex[index] = placementsByTerritoryIndex[index] || {};
      placementsByTerritoryIndex[index][unit] = placements[unit][index];
    })
  })
  console.log(placementsByTerritoryIndex)
  return state.map((territory, index) => {
    if (placementsByTerritoryIndex[index]) {
      const purchases = placementsByTerritoryIndex[index]
      let units = territory.units
      Object.keys(purchases).forEach(unitName => {
        const unit = units.find(u => u.name === unitName && u.power === currentPower)
        const count = purchases[unitName]
        let ids = new Array(count).fill('_').map(id)
        if (unit) {
          ids = unit.ids.concat(ids)
          units = units.map(u => u === unit ? { ...unit, ids } : u )
        } else {
          const newUnit = unitTypes[unitName]
          units = units.concat({ ...newUnit, power: currentPower, ids })
        }
      })
      return { ...territory, units }
    } else {
      return territory
    }
  })
}

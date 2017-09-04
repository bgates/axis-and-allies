import { STRATEGIC_BOMB } from '../../../actions'

export const completeMission = (state, action) => {
  return state.territories.map((territory, index) => {
    if (index === action.territoryIndex) {
      const completed = territory.unitsFrom.filter(u => u.mission === STRATEGIC_BOMB).map(u => ({ ...u, mission: 'complete' }))
      return { 
        ...territory, 
        unitsFrom: territory.unitsFrom.filter(u => u.mission !== STRATEGIC_BOMB),
        units: territory.units.concat(completed)
      }
    } else {
      return territory
    }
  })
}

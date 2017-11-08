import { createSelector } from 'reselect'
import { 
  getUnits,
  getTerritoryData 
} from '../../selectors/getTerritory'

export { getUnits } 

export const getIndustry = createSelector(
  getUnits,
  units => units.find(unit => unit.type === 'industrial complex')
)

export const getTerritoryName = createSelector(
  getTerritoryData,
  territory => territory.name
)

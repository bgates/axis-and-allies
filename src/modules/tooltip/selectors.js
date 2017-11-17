import { createSelector } from 'reselect'
import { 
  getUnits as getUnconsolidatedUnits,
  getTerritoryData 
} from '../../selectors/getTerritory'

export const getUnits = createSelector(
  getUnconsolidatedUnits,
  units => (units.filter(u => u.type !== 'industrial complex'))
)

export const getIndustry = createSelector(
  getUnits,
  units => units.find(unit => unit.type === 'industrial complex')
)

export const getTerritoryName = createSelector(
  getTerritoryData,
  territory => territory.name
)


import { createSelector } from 'reselect'
import { groupBy, values } from 'ramda'
import { getTerritoryData, getTerritoryUnits } from '../../selectors/getTerritory'

const same = unit => unit.type + unit.power

const groupedUnits = (units) => (
  values(groupBy(same)(units))
    .map(group => ({ ...group[0], qty: group.length }))
)

export const getUnits = createSelector(
  getTerritoryUnits,
  units => groupedUnits(units)
)

export const getIndustry = createSelector(
  getTerritoryUnits,
  units => units.find(unit => unit.type === 'industrial complex')
)

export const getTerritoryName = createSelector(
  getTerritoryData,
  territory => territory.name
)

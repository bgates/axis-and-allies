import { createSelector } from 'reselect'
import { groupBy, values } from 'ramda'
import { getTerritory, getTerritoryData } from '../../selectors/getTerritory'

const getAllUnits = (state) => state.units

const same = unit => unit.type + unit.power

const groupedUnits = (units) => (
  values(groupBy(same)(units))
    .map(group => ({ ...group[0], qty: group.length }))
)

const territoryUnits = createSelector(
  getTerritory,
  getAllUnits,
  (territory, units) => territory.unitIds.map(id => units[id])
)

export const getUnits = createSelector(
  territoryUnits,
  units => groupedUnits(units)
)

export const getIndustry = createSelector(
  territoryUnits,
  units => units.find(unit => unit.type === 'industrial complex')
)

export const getTerritoryName = createSelector(
  getTerritoryData,
  territory => territory.name
)

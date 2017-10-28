import { createSelector } from 'reselect'
import { groupBy, values } from 'ramda'
import territoryData from '../../config/territories.json'

const getUnitIds = (state, territoryIndex) =>
  state.territories[territoryIndex].units

const getAllUnits = (state) => state.units

const same = unit => unit.type + unit.power

const groupedUnits = (units) => (
  values(groupBy(same)(units))
    .map(group => ({ ...group[0], qty: group.length }))
)

const territoryUnits = createSelector(
  getUnitIds,
  getAllUnits,
  (ids, units) => ids.map(id => units[id])
)

export const getUnits = createSelector(
  territoryUnits,
  units => groupedUnits(units)
)

export const getIndustry = createSelector(
  territoryUnits,
  units => units.find(unit => unit.type === 'industrial complex')
)

const getTerritoryData = (_, territoryIndex) => territoryData[territoryIndex]

export const getTerritoryName = createSelector(
  getTerritoryData,
  territory => territory.name
)

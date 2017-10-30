import { createSelector } from 'reselect'
import { groupBy, values } from 'ramda'
import { 
  getTerritory,
  getTerritoryData, 
  getAllUnits,
  getOutboundUnits,
  getInboundUnits
} from '../../selectors/getTerritory'

const same = unit => unit.type + unit.power

const groupedUnits = (units) => (
  values(groupBy(same)(units))
    .map(group => ({ ...group[0], qty: group.length }))
)

const remove = (array) => id => !array.includes(id)

export const getUnits = createSelector(
  getTerritory,
  getAllUnits,
  getOutboundUnits,
  getInboundUnits,
  ({ unitIds }, allUnits, outbound, inbound) => (
    groupedUnits(unitIds
      .concat(inbound)
      .filter(remove(outbound))
      .map(id => allUnits[id]))
  )
)

export const getIndustry = createSelector(
  getUnits,
  units => units.find(unit => unit.type === 'industrial complex')
)

export const getTerritoryName = createSelector(
  getTerritoryData,
  territory => territory.name
)

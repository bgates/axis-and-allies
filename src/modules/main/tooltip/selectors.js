// @flow
import { createSelector } from 'reselect'
import { getCurrentPowerName } from '../../../selectors/getCurrentPower'
import { 
  getUnits as getUnfilteredUnits,
  getTerritoryData
} from '../../../selectors/getTerritory'
import { industry, nonIndustry } from '../../../selectors/units'
import { side } from '../../../config/initialPowers'
export { getCurrentPowerName }

export const getUnits = createSelector(
  getUnfilteredUnits,
  units => units.filter(nonIndustry)
)

export const getIndustry = createSelector(
  getUnfilteredUnits,
  units => units.find(industry)
)

export const getTerritoryName = createSelector(
  getTerritoryData,
  ({ name }) => name
)

export const getTerritoryValue = createSelector(
  getTerritoryData,
  ({ ipc_value }) => ipc_value
)

export const getSide = createSelector(
  getCurrentPowerName,
  currentPower => side(currentPower)
)

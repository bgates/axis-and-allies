// @flow
import { createSelector } from 'reselect'
import { getAmphib, getBombardment, getInboundUnits } from '../../selectors/stateSlices'
import { getCurrentPowerName } from '../../selectors/getCurrentPower'
import { 
  amphibOrigins, 
  getFocusTerritory, 
  getTerritoryData,
  getUnits 
} from '../../selectors/getTerritory'
import { 
  canBombard,
  combineUnits,
  unitWithOrigin
} from '../../selectors/units'

const bombardmentCapableUnits = ({ index }, currentPower, amphib, inboundUnits, { bombardingUnits }, state) => (
  amphibOrigins(amphib, inboundUnits, index)
    .map(i => (
      getUnits(state, i)
        .map(unitWithOrigin(getTerritoryData(null, i), '0')
    )))
    .reduce((total, units) => total.concat(units.filter(canBombard)), [])
    .filter(unit => !bombardingUnits[unit.id] || bombardingUnits[unit.id] === index)
    .reduce(combineUnits, [])
)

export const getBombardmentCapableUnits = createSelector(
  getFocusTerritory,
  getCurrentPowerName,
  getAmphib,
  getInboundUnits,
  getBombardment,
  state => state,
  bombardmentCapableUnits
)

export const getBombardingIds = createSelector(
  getFocusTerritory,
  getBombardment,
  ({ index }, { targetTerritories }) => targetTerritories[index] || []
)


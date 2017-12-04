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

const bombardmentCapableUnits = ({ index }, currentPower, amphib, inboundUnits, { bombardingUnits }) => {
  return amphibOrigins(amphib, inboundUnits, index)
    .map(i => getUnits(null, i).map(unitWithOrigin(getTerritoryData(null, i))))
    .reduce((total, units) => total.concat(units.filter(canBombard)), [])
    .filter(unit => !bombardingUnits[unit.id] || bombardingUnits[unit.id] === index)
    .reduce(combineUnits, [])
}

export const getBombardmentCapableUnits = createSelector(
  getFocusTerritory,
  getCurrentPowerName,
  getAmphib,
  getInboundUnits,
  getBombardment,
  bombardmentCapableUnits
)

export const getBombardingIds = createSelector(
  getFocusTerritory,
  getBombardment,
  ({ index }, { targetTerritories }) => targetTerritories[index] || []
)


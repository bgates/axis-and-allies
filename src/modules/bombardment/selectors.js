import { createSelector } from 'reselect'
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

const bombardmentCapableUnits = ({ index }, currentPower, amphib, inboundUnits, { bombardingUnits }, state) => {
  return amphibOrigins(amphib, inboundUnits, index)
    .map(i => getUnits(state, i).map(unitWithOrigin(getTerritoryData(state, i))))
    .reduce((total, units) => total.concat(units.filter(canBombard)), [])
    .filter(unit => !bombardingUnits[unit.id] || bombardingUnits[unit.id] === index)
    .reduce(combineUnits, [])
}

export const getBombardmentCapableUnits = createSelector(
  getFocusTerritory,
  getCurrentPowerName,
  state => state.amphib,
  state => state.inboundUnits,
  state => state.bombardment,
  state => state,
  bombardmentCapableUnits
)

export const getBombardingIds = createSelector(
  getFocusTerritory,
  state => state.bombardment,
  ({ index }, { targetTerritories }) => targetTerritories[index] || []
)


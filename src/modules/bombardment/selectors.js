import { createSelector } from 'reselect'
import { getCurrentPowerName } from '../../selectors/getCurrentPower'
import { amphibOrigins, getFocusTerritory, getUnits } from '../../selectors/getTerritory'
import { canBombard } from '../../selectors/units'

export const getBombardmentCapableUnits = createSelector(
  getFocusTerritory,
  getCurrentPowerName,
  state => state.amphib,
  state => state.inboundUnits,
  state => state,
  bombardmentCapableUnits
)

const bombardmentCapableUnits = ({ index }, currentPower, amphib, inboundUnits, state) => {
  return amphibOrigins(amphib, inboundUnits, index)
    .map(i => getUnits(state, i))
    .reduce((total, units) => total.concat(units.filter(canBombard)), [])
}

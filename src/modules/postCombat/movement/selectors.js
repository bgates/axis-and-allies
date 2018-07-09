import { createSelector } from 'reselect'
import { 
  getAllInbound, 
  getBombardment, 
  getRecentlyConquered,
  getTransport 
} from '../../../selectors/stateSlices'
import { getCurrentPower } from '../../../selectors/getCurrentPower'
import { getCommittedIds, getFocusTerritory } from '../../../selectors/getTerritory'
import { air } from '../../../selectors/units'
import { 
  unitsInRange as tooBroadUnits, 
  territoryLandingSlots
} from '../../planCombat'
import { getUnits } from '../../main/tooltip'
export { getCurrentPower, getFocusTerritory, getCommittedIds, territoryLandingSlots }

export const getOccupants = createSelector(
  getUnits,
  units => ({ defenders: units, attackers: [] })
)
export const unitsInRange = createSelector(
  getFocusTerritory,
  tooBroadUnits,
  getAllInbound,
  getBombardment,
  getTransport,
  getRecentlyConquered,
  ({ index, unitIds }, units, inbound, { bombardingUnits }, transports, conquered) => units.filter(
    ({ id, type }) => (
      (!inbound[id] || inbound[id] === index || transports.newlyLoaded.includes(id)) &&
      (!conquered[index] || !air({ type })) &&
      !unitIds.includes(id) && 
      !bombardingUnits[id]
    )
  )
)

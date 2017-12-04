import { createSelector } from 'reselect'
import { getAllInbound, getBombardment, getTransport } from '../../selectors/stateSlices'
import { getCurrentPower } from '../../selectors/getCurrentPower'
import { getCommittedIds, getFocusTerritory } from '../../selectors/getTerritory'
import { 
  unitsInRange as tooBroadUnits, 
  territoryLandingSlots
} from '../planCombat'
import { getUnits } from '../tooltip'
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
  (territory, units, inbound, { bombardingUnits }, transports) => units.filter(
    ({ id }) => (!inbound[id] || inbound[id] === territory.index || transports.newlyLoaded.includes(id)) && 
                !territory.unitIds.includes(id) && 
                !bombardingUnits[id])
)


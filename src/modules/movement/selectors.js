import { createSelector } from 'reselect'
import { getAllInbound, getBombardment, getTransport } from '../../selectors/stateSlices'
import { getCurrentPower } from '../../selectors/getCurrentPower'
import { getFocusTerritory } from '../../selectors/getTerritory'
import { 
  unitsInRange as tooBroadUnits, 
  combinedCombatants, 
  getCommittedIds, 
} from '../planCombat'
import { getTerritoryUnits } from '../../selectors/getTerritory'
export { getCurrentPower, getFocusTerritory, combinedCombatants, getCommittedIds }

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

//TODO...
export const territoryLandingSlots = state => getTerritoryUnits ? [] : null

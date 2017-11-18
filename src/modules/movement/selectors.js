import { createSelector } from 'reselect'
import { getCurrentPower } from '../../selectors/getCurrentPower'
import { getFocusTerritory } from '../../selectors/getTerritory'
import { 
  unitsInRange as tooBroadUnits, 
  combinedCombatants, 
  getCommittedIds, 
  getTransport 
} from '../planCombat'
import { getAllInbound } from '../../selectors/units'
import { getTerritoryUnits } from '../../selectors/getTerritory'
export { getCurrentPower, getFocusTerritory, combinedCombatants, getCommittedIds }

const getBombardingUnits = state => state.bombardment.bombardingUnits

export const unitsInRange = createSelector(
  getFocusTerritory,
  tooBroadUnits,
  getAllInbound,
  getBombardingUnits,
  getTransport,
  (territory, units, inbound, bombarding, transports) => units.filter(
    ({ id }) => (!inbound[id] || inbound[id] === territory.index || transports.newlyLoaded.includes(id)) && 
                !territory.unitIds.includes(id) && 
                !bombarding[id])
)

//TODO...
export const territoryLandingSlots = state => getTerritoryUnits ? [] : null

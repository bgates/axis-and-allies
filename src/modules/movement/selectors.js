import { createSelector } from 'reselect';
import { getCurrentPower } from '../../selectors/getCurrentPower';
import { getFocusTerritory } from '../../selectors/mergeBoardAndTerritories';
import { unitsInRange as tooBroadUnits } from '../planCombat';
import { consolidateUnits, nonIndustry, duplicateUnit } from '../../lib/unit';
import { allUnits } from '../../lib/territory';
export { getCurrentPower, getFocusTerritory }

const _occupants = (territory) => {
  const units = allUnits(territory).filter(nonIndustry).map(duplicateUnit)
  return { attackers: consolidateUnits(units), defenders: [] }
}

export const occupants = createSelector(
  getFocusTerritory,
  territory => _occupants(territory)
)

export const unitsInRange = createSelector(
  tooBroadUnits,
  units => units.filter(unit => unit.mission !== 'complete' && unit.distance)
)

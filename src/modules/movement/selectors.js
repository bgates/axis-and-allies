import { createSelector } from 'reselect';
import { getCurrentPower } from '../../selectors/getCurrentPower';
import { mergeBoardAndTerritories, getFocusTerritory } from '../../selectors/mergeBoardAndTerritories';
import { unitsInRange } from '../planCombat';
import { sameSide } from '../../config/initialPowers';
import { consolidateUnits, nonIndustry, duplicateUnit } from '../../lib/unit';
export { getCurrentPower, getFocusTerritory, unitsInRange }

const _occupants = (territory) => {
  const units = territory.units
    .filter(nonIndustry)
    .map(duplicateUnit)
  return consolidateUnits(units)
}

export const occupants = createSelector(
  getFocusTerritory,
  territory => _occupants(territory)
)



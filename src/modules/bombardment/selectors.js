import { createSelector } from 'reselect';
import { getCurrentPower } from '../../selectors/getCurrentPower';
import { mergeBoardAndTerritories, getFocusTerritory } from '../../selectors/mergeBoardAndTerritories';
import { bombardmentCapableUnits } from '../../lib/territory'
export { getFocusTerritory }

export const getBombardmentCapableUnits = createSelector(
  mergeBoardAndTerritories,
  getFocusTerritory,
  getCurrentPower,
  (board, territory, currentPower) => bombardmentCapableUnits(board, territory, currentPower)
)


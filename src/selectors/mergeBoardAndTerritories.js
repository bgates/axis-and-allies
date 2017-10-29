import { createSelector } from 'reselect'
import territoryData from '../config/territories.json'

export const mergeBoardAndTerritories = createSelector(
  state => state.board,
  board => board.territories.map((territoryState, index) => {
    const { name, original_power, sea, adjacentIndexes }= territoryData[index]
    return {...territoryState, name, original_power, sea, adjacentIndexes, index}
  })
);
   
export const getFocusTerritory = createSelector(
  state => state.phase,
  mergeBoardAndTerritories,
  (phase, territories) => territories[phase.territory.index]
);



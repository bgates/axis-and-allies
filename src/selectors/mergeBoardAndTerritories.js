import { createSelector } from 'reselect';
import territoryData from '../config/territories.json';

export const mergeBoardAndTerritories = createSelector(
  state => state.board,
  board => board.territories.map((territoryState, index) => {
    let territoryProps = territoryData[index]
    return {...territoryState, ...territoryProps, index}
  })
);

export const getFocusTerritory = createSelector(
  state => state.phase,
  mergeBoardAndTerritories,
  (phase, territories) => territories[phase.territory.index]
);



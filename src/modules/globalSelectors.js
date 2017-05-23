import { createSelector } from 'reselect';
import territoryData from '../config/territories.json';

export const getCurrentPower = createSelector(
  state => state.powers,
  powers => powers.find(power => power.current)
);

export const mergeBoardAndTerritories = createSelector(
  state => state.board,
  board => board.map((territoryState, index) => {
    let territoryProps = territoryData[index]
    return {...territoryState, ...territoryProps, index}
  })
);

export const getFocusTerritory = createSelector(
  state => state.phase,
  mergeBoardAndTerritories,
  (phase, territories) => territories[phase.territory.index]
);


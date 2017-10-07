import { createSelector } from 'reselect';

export const getPowers = (state) => state.board.powers

const currentPowerIndex = (state) => state.board.currentPowerIndex 

export const getCurrentPower = createSelector(
  getPowers,
  currentPowerIndex,
  (powers, index) => powers[index]
);


import { createSelector } from 'reselect';

export const getPowers = (state) => state.board.powers

export const getCurrentPower = createSelector(
  getPowers,
  powers => powers.find(power => power.current)
);


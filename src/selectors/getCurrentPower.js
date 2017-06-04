import { createSelector } from 'reselect';

export const getCurrentPower = createSelector(
  state => state.powers,
  powers => powers.find(power => power.current)
);


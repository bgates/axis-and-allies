import { createSelector } from 'reselect';
import { getCurrentPower } from '../../selectors/getCurrentPower';
import researchOptions from '../../config/research';
export { getCurrentPower }

export const currentPowerHasRockets = createSelector(
  getCurrentPower,
  currentPower => currentPower.tech.includes('rockets')
);

export const research = (state) => Object.assign({}, researchOptions, state.research)

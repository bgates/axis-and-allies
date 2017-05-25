import { createSelector } from 'reselect';
import { getCurrentPower, mergeBoardAndTerritories } from '../globalSelectors';
export { getCurrentPower, mergeBoardAndTerritories }

const pathRequiresOverlay = (pathname) => {
  return ['/research', '/research/results', '/rockets', '/purchase', '/income'].includes(pathname)
};

const phaseRequiresOverlay = (phase) => {
  return ['plan-attack', 'load-transport'].includes(phase)
};

export const overlayPhase = createSelector(
  state => state.router.location.pathname,
  state => state.phase.current,
  (pathname, phase) => pathRequiresOverlay(pathname) || 
           phaseRequiresOverlay(phase)
);

export const advanceButtonPhase = (state) => {
  return ['plan-combat', 'resolve-combat'].includes(state.phase.current)
};


import { createSelector } from 'reselect';

const pathRequiresOverlay = (pathname) => {
  return ['/research', '/research/results', '/rockets', '/purchase', '/income', '/combat-rolls'].includes(pathname)
};

const phaseRequiresOverlay = (phase) => {
  return ['plan-attack', 'plan-land-planes', 'load-transport', 'combat', 'select-casualties'].includes(phase)
};

export const overlayPhase = createSelector(
  state => state.router.location.pathname,
  state => state.phase.current,
  (pathname, phase) => pathRequiresOverlay(pathname) || 
           phaseRequiresOverlay(phase)
);

export const advanceButtonPhase = (state) => {
  return ['plan-combat', 'resolve-combat', 'confirm-land-planes', 'move-units'].includes(state.phase.current)
};


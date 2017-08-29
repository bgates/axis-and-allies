import { createSelector } from 'reselect';
import { noCombat } from '../selectCasualties';

const pathRequiresOverlay = (pathname) => {
  return ['/research', '/research/results', '/rockets', '/purchase', '/income', '/combat-rolls', '/place-units', '/confirm'].includes(pathname)
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

export const phases = createSelector(
  noCombat,
  state => state.phase.current,
  (noCombat, phase) => {
    if (['plan-combat', 'resolve-combat'].includes(phase)) {
      const next = noCombat ? 'move-units' : 'resolve-combat';
      return { next, last: 'income' }
    } else if (phase === 'move-units') {
      return { next: 'place-units', last: 'land-planes' }
    }  
  } 
)


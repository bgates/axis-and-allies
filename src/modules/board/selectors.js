import { createSelector } from 'reselect';
import { getCurrentPower } from '../../selectors/getCurrentPower';
import { noCombat } from '../selectCasualties';
import { 
  PLAN_ATTACKS, 
  VIEW_ATTACK_OPTIONS, 
  VIEW_TRANSPORT_LOAD_OPTIONS, 
  VIEW_BOMBARDMENT_OPTIONS,
  PLAN_MOVEMENT,
  VIEW_MOVEMENT_OPTIONS,
  VIEW_PLANE_LANDING_OPTIONS,
  ORDER_UNITS,
  CONFIRM_FINISH
} from '../../actions';
import PATHS from '../../paths';

const pathRequiresOverlay = (pathname) => {
  return [PATHS.RESEARCH, PATHS.RESEARCH_RESULTS, PATHS.ROCKETS, PATHS.PURCHASE, 
    PATHS.INCOME, PATHS.STRATEGIC_BOMB, PATHS.RETREAT, PATHS.COMBAT_ROLLS, PATHS.PLACE_UNITS].includes(pathname)
};

const phaseRequiresOverlay = (phase) => {
  return [VIEW_ATTACK_OPTIONS, VIEW_TRANSPORT_LOAD_OPTIONS, VIEW_BOMBARDMENT_OPTIONS, VIEW_PLANE_LANDING_OPTIONS, 'combat', PATHS.SELECT_CASUALTIES, VIEW_MOVEMENT_OPTIONS, 'order-units-territory'].includes(phase)
};

export const overlayPhase = createSelector(
  state => state.router.location.pathname,
  state => state.phase.current,
  (pathname, phase) => pathRequiresOverlay(pathname) || 
           phaseRequiresOverlay(phase)
);

export const advanceButtonPhase = (state) => {
  return [PLAN_ATTACKS, 'confirm-land-planes', PLAN_MOVEMENT, PATHS.ORDER_UNITS, CONFIRM_FINISH].includes(state.phase.current)
};

const canPlace = createSelector(
  getCurrentPower,
  state => state.purchases,
  (currentPower, purchases) => currentPower.name === 'China' || Object.keys(purchases).length
)

//TODO: combine this w previousPhase selector?
export const phases = createSelector(
  noCombat,
  state => state.phase.current,
  canPlace,
  (noCombat, phase, canPlaceUnits) => {
    if ([PLAN_ATTACKS, 'resolve-combat'].includes(phase)) {
      const next = noCombat ? PLAN_MOVEMENT : 'resolve-combat';
      return { next, last: 'income' }
    } else if (phase === PLAN_MOVEMENT) {
      const next = canPlaceUnits ? 'place-units' : ORDER_UNITS
      return { next, last: 'land-planes' }
    } else if (phase === ORDER_UNITS) {
      return { next: 'confirm-finish', last: 'place-units', text: 'Order by Cost' }
    } else {
      return {}
    }
  } 
)


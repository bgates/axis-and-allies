// @flow
import { createSelector } from 'reselect'
import { getCurrentPhase, getPathname } from '../../../selectors/stateSlices'
import { nextPhase, previousPhase } from '../../../selectors/previousPhase'
import { isCombat } from '../../../selectors/combatSubphase'
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
} from '../../../actions'
import PATHS from '../../../paths'
export { nextPhase, previousPhase }

const pathRequiresOverlay = (pathname) => {
  return [PATHS.RESEARCH, PATHS.RESEARCH_RESULTS, PATHS.ROCKETS, PATHS.ROCKET_RESULTS, PATHS.PURCHASE, 
    PATHS.INCOME, PATHS.FLAK, PATHS.STRATEGIC_BOMB, PATHS.RETREAT, PATHS.COMBAT_ROLLS, PATHS.RUSSIAN_WINTER, PATHS.PLACE_UNITS].includes(pathname)
}

const phaseRequiresOverlay = (phase) => {
  return [VIEW_ATTACK_OPTIONS, VIEW_TRANSPORT_LOAD_OPTIONS, VIEW_BOMBARDMENT_OPTIONS, VIEW_PLANE_LANDING_OPTIONS, 'combat', PATHS.SELECT_CASUALTIES, VIEW_MOVEMENT_OPTIONS, 'order-units-territory'].includes(phase)
}

export const overlayPhase = createSelector(
  getPathname,
  getCurrentPhase,
  (pathname, phase) => pathRequiresOverlay(pathname) || 
           phaseRequiresOverlay(phase)
)

export const advanceButtonPhase = (state:{ phase: {current: string} }) => {
  return [PLAN_ATTACKS, 'confirm-land-planes', PLAN_MOVEMENT, PATHS.ORDER_UNITS, CONFIRM_FINISH].includes(state.phase.current)
}

export const noCombat = (state:{unitDestination:Object, amphib:Object}) => {
  const { unitDestination, amphib } = state
  return !(Object.keys(unitDestination).find(index => isCombat(state, index)) ||
         Object.keys(amphib.territory).find(index => isCombat(state, index)))
}

export const showNavLinks = createSelector(
  getCurrentPhase,
  phase => [PLAN_ATTACKS, PLAN_MOVEMENT, 'resolve-combat', ORDER_UNITS].includes(phase)
)

export const navLinkText = createSelector(
  getCurrentPhase,
  phase => phase === ORDER_UNITS ? 'Order by Cost' : 'Done'
)


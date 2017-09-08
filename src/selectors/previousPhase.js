import { createSelector } from 'reselect';
import { getCurrentPower } from '../selectors/getCurrentPower';
import { mergeBoardAndTerritories } from '../selectors/mergeBoardAndTerritories';
import { hasDamagedShipsInHarbor } from '../modules/repair';
import { currentPowerHasRockets } from '../modules/research';
import PATHS from '../paths';

export const previousPhase = createSelector(
  getCurrentPower,
  mergeBoardAndTerritories,
  currentPowerHasRockets,
  hasDamagedShipsInHarbor,
  state => state.phase,
  (currentPower, board, hasRockets, hasDamagedShips, phase) => {
    const phases = {
      [PATHS.REPAIR]: () => 'start',
      [PATHS.RESEARCH]: () => hasDamagedShips ? PATHS.REPAIR : 'start',
      [PATHS.RESEARCH_RESULTS]: () => PATHS.RESEARCH_RESULTS,
      [PATHS.ROCKETS]: () => phase.minimum.includes(PATHS.RESEARCH_RESULTS) ? PATHS.RESEARCH_RESULTS : PATHS.RESEARCH,
      [PATHS.ROCKET_RESULTS]: () => PATHS.ROCKET_RESULTS,
      [PATHS.PURCHASE]: () => {
        if (phase.minimum.includes(PATHS.ROCKET_RESULTS)) {
          return PATHS.ROCKET_RESULTS
        } else if (hasRockets) {
          return PATHS.ROCKETS
        } else if (phase.minimum.includes(PATHS.RESEARCH_RESULTS)) {
          return PATHS.RESEARCH_RESULTS
        } else {
          return PATHS.RESEARCH
        }
      },
      [PATHS.INCOME]: () => PATHS.PURCHASE,
      [PATHS.LEND_LEASE]: () => PATHS.INCOME,
      [PATHS.PLAN_ATTACKS]: () => currentPower.name === 'US' ? PATHS.LEND_LEASE : PATHS.INCOME,
      [PATHS.RESOLVE_COMBAT]: () => PATHS.PLAN_ATTACKS,
      [PATHS.LAND_PLANES]: () => PATHS.RESOLVE_COMBAT,
      'russian-winter': () => PATHS.LAND_PLANES,
      [PATHS.PLAN_MOVEMENT]: () => currentPower.name === 'USSR' ? 'russian-winter' : PATHS.LAND_PLANES,
      [PATHS.PLACE_UNITS]: () => PATHS.PLAN_MOVEMENT,
      'carrier-loading': () => PATHS.PLACE_UNITS, //assuming units placed, otherwise movement
      [PATHS.ORDER_UNITS]: () => 'carrier-loading', //if naval planes purchased & carriers available, otherwise placement or movement
      [PATHS.CONFIRM_FINISH]: () => PATHS.ORDER_UNITS
    }
    return (phases[phase.current] && phases[phase.current]()) || 'start'
  }
)


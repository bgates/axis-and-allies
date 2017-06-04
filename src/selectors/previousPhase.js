import { createSelector } from 'reselect';
import { getCurrentPower } from '../selectors/getCurrentPower';
import { mergeBoardAndTerritories } from '../selectors/mergeBoardAndTerritories';
import { hasDamagedShipsInHarbor } from '../modules/repair';
import { currentPowerHasRockets } from '../modules/research';

export const previousPhase = createSelector(
  getCurrentPower,
  mergeBoardAndTerritories,
  currentPowerHasRockets,
  hasDamagedShipsInHarbor,
  state => state.phase,
  (currentPower, board, hasRockets, hasDamagedShips, phase)=> {
    switch (phase.current) {
      case 'repair': {
        return 'start'
      }
      case 'research': {
        if (hasDamagedShips) {
          return 'repair'
        } else {
          return 'start'
        }
      }
      case 'research/results': {
        return 'research/results'
      }
      case 'rockets': {
        if (phase.minimum.includes('research/results')) {
          return 'research/results'
        } else {
          return 'research'
        }
      }
      case 'rockets/results': {
        return 'rockets/results'
      }
      case 'purchase': {
        if (phase.minimum.includes('rockets/results')) {
          return 'rockets/results'
        } else if (hasRockets) {
          return 'rockets'
        } else if (phase.minimum.includes('research/results')) {
          return 'research/results'
        } else {
          return 'research'
        }
      }
      case 'income': {
        return 'purchase'
      }
      case 'lend-lease': {
        return 'income'
      }
      case 'plan-combat': {
        if (currentPower.name === 'US') {
          return 'lend-lease'
        } else {
          return 'income'
        }
      }
      case 'resolve-combat': {
        return 'plan-combat'
      }
      case 'plane-landing': {
        return 'resolve-combat'
      }
      case 'russian-winter': {
        return 'plane-landing'
      }
      case 'movement': {
        if (currentPower.name === 'USSR') {
          return 'russian-winter'
        } else {
          return 'plane-landing'
        }
      }
      case 'placement': {
        return 'movement'
      }
      case 'carrier-loading': {
        return 'placement' //assuming units placed, otherwise movement
      }
      case 'order': {
        return 'carrier-loading' //if naval planes purchased & carriers available, otherwise placement or movement
      }
      case 'confirm': {
        return 'order'
      }
      default: 
        return 'start'
    }
  }
)


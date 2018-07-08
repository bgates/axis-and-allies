// @flow
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import Territory from './Territory'
import { 
  getFill, 
  getTerritoryId,
  getTerritoryDimensions,
  getClasses, 
  isAttackable, 
  isOrdering 
} from './selectors'
import { getCurrentPowerName } from '../../../selectors/getCurrentPower'
import { isCombat } from '../../../selectors/combatSubphase'
import { isFriendly } from '../../../selectors/getTerritory'
import { nextPhase } from '../../../selectors/previousPhase'
import { overlayPhase } from '../board'
import { 
  enterCombatLifecycle,
  viewAttackOptions, 
  viewPlaneLandingOptions,
  viewMovementOptions,
  orderUnits,
} from '../../../actions'
import PATHS from '../../../paths'
import type { Dispatch } from 'redux';

const mapStateToProps = (state, ownProps) => {
  const { territoryIndex } = ownProps
  return {
    fill: getFill(state, territoryIndex),
    dimensions: getTerritoryDimensions(state, territoryIndex),
    id: getTerritoryId(state, territoryIndex),
    classNames: getClasses(state, territoryIndex),
    ...ownProps
  }
}

const territoryThunk = (territoryIndex) => {
  return (dispatch, getState) => {
    const state = getState()
    if (overlayPhase(state)) {
      return
    }
    const territory = state.territories[territoryIndex]
    const { router, phase, flightDistance, landPlanes, units } = state 
    const currentPower = getCurrentPowerName(state)
    const routes = {
      '/': () => {
        dispatch(push(nextPhase(state)))
      }, 
      [PATHS.PLAN_ATTACKS]: () => {
        if (isAttackable(state, territoryIndex)) {
          dispatch(viewAttackOptions(territoryIndex))
        }
      },
      [PATHS.RESOLVE_COMBAT]: () => {
        if (isCombat(state, territoryIndex)) {
          dispatch(enterCombatLifecycle(territoryIndex))
          dispatch(push(PATHS.COMBAT))
        }
      },
      [PATHS.LAND_PLANES]: () => {
        if (Object.keys(flightDistance).length >= Object.keys(landPlanes).length) {
          dispatch(viewPlaneLandingOptions(territoryIndex))
        }
      },
      [PATHS.PLAN_MOVEMENT]: () => {
        if (isFriendly(territory, currentPower, units)) {
          dispatch(viewMovementOptions(territoryIndex))
        }
      },
      [PATHS.ORDER_UNITS]: () => {
        const { units } = territory
        if (isOrdering(phase.current, currentPower, territory.currentPower, units)) {
          dispatch(orderUnits(territory)) 
        }
      },
      [PATHS.CONFIRM_FINISH]: () => {}
    }
    routes[router.location.pathname]()
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const { territoryIndex } = ownProps
  return {
    handleClick: bindActionCreators(territoryThunk.bind(null, territoryIndex), dispatch)
  }
}

const TerritoryContainer = connect(mapStateToProps, mapDispatchToProps)(Territory)

export default TerritoryContainer

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import Territory from './Territory'
import { getFill, getClasses, isOrdering } from './selectors'
import { getCurrentPower } from '../../selectors/getCurrentPower'
import { hasDamagedShipsInHarbor } from '../repair'
import { overlayPhase } from '../board'
import { airComplete } from '../../lib/unit'
import { 
  isBombardable,
  isAttackable, 
  isDogfightable,
  isCombat,
  isBombed,
  bomberPayload,
  awaitingNavalResolution
} from '../../lib/territory'
import dice from '../../lib/numericalDieRolls'
import { 
  viewAttackOptions, 
  STRATEGIC_BOMB,
  dogfight,
  strategicBombingRolls,
  resolveCombat, 
  viewPlaneLandingOptions,
  viewMovementOptions,
  orderUnits,
  roll
} from '../../actions';
import PATHS from '../../paths';

const mapStateToProps = (state, ownProps) => {
  return {
    fill: getFill(ownProps.territory),
    classNames: getClasses(state, ownProps.territory),
    ...ownProps
  }
}

const territoryThunk = (territory) => {
  return (dispatch, getState) => {
    const state = getState()
    if (overlayPhase(state)) {
      return
    }
    const { router, phase } = state 
    const currentPowerName = getCurrentPower(state).name
    const routes = {
      '/': () => {
        if (currentPowerName === 'China') {
          dispatch(push(PATHS.PLAN_ATTACKS))
        } else {
          const nextUrl = hasDamagedShipsInHarbor(state) ? PATHS.REPAIR : PATHS.RESEARCH
          dispatch(push(nextUrl)) 
        }
      }, 
      [PATHS.PLAN_ATTACKS]: () => {
        if (isAttackable(territory, currentPowerName)) {
          dispatch(viewAttackOptions(territory))
        }
      },
      [PATHS.RESOLVE_COMBAT]: () => {
        // need logic to prevent dispatch if no combat
        if (isCombat(territory)) {
          if (awaitingNavalResolution(territory, state)) {
            return alert('not yet!')
          }
          if (isDogfightable(territory)) {
            dispatch(dogfight(territory))
          } else if (isBombed(territory)) {
            bombRaid(dispatch, territory)
          } else {
            dispatch(resolveCombat(territory))
          }
        }
      },
      [PATHS.LAND_PLANES]: () => {
        if (territory.units && territory.units.filter(airComplete).length) {
          dispatch(viewPlaneLandingOptions(territory))
        }
      },
      [PATHS.PLAN_MOVEMENT]: () => dispatch(viewMovementOptions(territory)),
      [PATHS.ORDER_UNITS]: () => {
        const { currentPower, units } = territory;
        if (isOrdering(phase.current, currentPowerName, currentPower, units)) {
          dispatch(orderUnits(territory)) 
        }
      }
    }
    routes[router.location.pathname]()
  }
}

export const bombRaid = (dispatch, territory) => {
  const rolls = dice(bomberPayload(territory))
  dispatch(roll(PATHS.STRATEGIC_BOMB, rolls))
  dispatch(strategicBombingRolls(territory))
  dispatch(push(PATHS.STRATEGIC_BOMB))
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleClick: bindActionCreators(territoryThunk, dispatch)
  }
}

const TerritoryContainer = connect(mapStateToProps, mapDispatchToProps)(Territory)

export default TerritoryContainer

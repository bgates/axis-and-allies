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
  isAttackable, 
  isDogfightable,
  isCombat,
  isBombed,
  bomberPayload,
} from '../../lib/territory'
import dice from '../../lib/numericalDieRolls'
import { 
  viewAttackOptions, 
  STRATEGIC_BOMB,
  dogfight,
  viewStrategicBombingResults,
  resolveCombat, 
  viewPlaneLandingOptions,
  viewMovementOptions,
  orderUnits,
  roll
} from '../../actions';

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
          dispatch(push('/plan-combat'))
        } else {
          const nextUrl = hasDamagedShipsInHarbor(state) ? 'repair' : 'research'
          dispatch(push(nextUrl)) 
        }
      }, 
      '/plan-combat': () => {
        if (isAttackable(territory, currentPowerName)) {
          dispatch(viewAttackOptions(territory))
        }
      },
      '/resolve-combat': () => {
        // need logic to prevent dispatch if no combat
        if (isCombat(territory)) {
          if (isDogfightable(territory)) {
            dispatch(dogfight(territory))
          } else if (isBombed(territory)) {
            bombRaid(dispatch, territory)
          } else {
            dispatch(resolveCombat(territory))
          }
        }
      },
      '/land-planes': () => {
        if (territory.units && territory.units.filter(airComplete).length) {
          dispatch(viewPlaneLandingOptions(territory))
        }
      },
      '/move-units': () => dispatch(viewMovementOptions(territory)),
      '/order-units': () => {
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
  dispatch(roll(STRATEGIC_BOMB, rolls))
  dispatch(viewStrategicBombingResults(territory))
  dispatch(push('/strategic-bomb'))
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleClick: bindActionCreators(territoryThunk, dispatch)
  }
}

const TerritoryContainer = connect(mapStateToProps, mapDispatchToProps)(Territory)

export default TerritoryContainer

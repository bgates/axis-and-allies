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
import { getCurrentPower } from '../../selectors/getCurrentPower'
import { hasDamagedShipsInHarbor } from '../repair'
import { overlayPhase } from '../board'
import { airComplete } from '../../lib/unit'
import { 
  isFriendly,
  isBombardable,
  isDogfightable,
  isCombat,
  isBombed,
  bomberPayload,
  awaitingNavalResolution
} from '../../lib/territory'
import dice from '../../lib/numericalDieRolls'
import { 
  viewAttackOptions, 
  dogfight,
  strategicBombingRolls,
  resolveCombat, 
  viewPlaneLandingOptions,
  viewMovementOptions,
  viewBombardmentOptions,
  orderUnits,
  roll
} from '../../actions';
import PATHS from '../../paths';

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
    const { router, phase } = state 
    const currentPower = getCurrentPower(state)
    const routes = {
      '/': () => {
        if (currentPower.name === 'China') {
          dispatch(push(PATHS.PLAN_ATTACKS))
        } else {
          const nextUrl = hasDamagedShipsInHarbor(state) ? PATHS.REPAIR : PATHS.RESEARCH
          dispatch(push(nextUrl)) 
        }
      }, 
      [PATHS.PLAN_ATTACKS]: () => {
        if (isAttackable(state, territoryIndex)) {
          dispatch(viewAttackOptions(territoryIndex))
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
          } else if (isBombardable(territory, currentPower, state)) {
            dispatch(viewBombardmentOptions(territory))
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
      [PATHS.PLAN_MOVEMENT]: () => {
        if (isFriendly(territory, currentPower)) {
          dispatch(viewMovementOptions(territory))
        }
      },
      [PATHS.ORDER_UNITS]: () => {
        const { units } = territory;
        if (isOrdering(phase.current, currentPower.name, territory.currentPower, units)) {
          dispatch(orderUnits(territory)) 
        }
      },
      [PATHS.CONFIRM_FINISH]: () => {}
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

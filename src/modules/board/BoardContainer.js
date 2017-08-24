import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import Board from './Board'
import { hasDamagedShipsInHarbor } from '../repair'
import { 
  overlayPhase,
  advanceButtonPhase,
} from './selectors'
import { getCurrentPower } from '../../selectors/getCurrentPower';
import { mergeBoardAndTerritories } from '../../selectors/mergeBoardAndTerritories';
import { 
  planAttack, 
  resolveCombat, 
  planLandPlanes,
  planMovement 
} from '../../actions';

const mapStateToProps = (state) => {
  return {
    board: mergeBoardAndTerritories(state),
    phase: state.phase,
    router: state.router,
    hasOverlay: overlayPhase(state),
    advanceBtn: advanceButtonPhase(state),
    currentPower: getCurrentPower(state),
  }
}

const isUrl = (router, url) => router.location.pathname === url

const territoryThunk = (territory) => {
  return (dispatch, getState) => {
    let state = getState()
    if (overlayPhase(state)) {
      return
    }
    let { router, phase } = state 
    if (phase.current === 'start') {
      let nextUrl = hasDamagedShipsInHarbor(state) ? 'repair' : 'research'
      dispatch(push(nextUrl))
    } else if (isUrl(router, '/plan-combat')) {
      dispatch(planAttack(territory))
    } else if (isUrl(router, '/resolve-combat')) {
      // need logic to prevent dispatch if no combat
      if (territory.unitsFrom.length && territory.units.length) {
        dispatch(resolveCombat(territory))
      }
    } else if (isUrl(router, '/land-planes')) {
      if (territory.newlyConquered && territory.units.filter(u => u.air).length) {
        dispatch(planLandPlanes(territory))
      }
    } else if (isUrl(router, '/noncombat-movement')) {
      dispatch(planMovement(territory))
    } else {
      dispatch({ type: 'TERRITORY_CLICKED' })
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    territoryClick: bindActionCreators(territoryThunk, dispatch)
  }
}

const BoardContainer = connect(mapStateToProps, mapDispatchToProps)(Board)

export default BoardContainer


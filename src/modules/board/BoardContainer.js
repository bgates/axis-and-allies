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

    } else if (router.location.pathname === '/plan-combat') {
      dispatch({ type: 'PLAN_ATTACK', territory })
    } else if (router.location.pathname === '/resolve-combat') {
      // need logic to prevent dispatch if no combat
      if (territory.unitsFrom.length) {
        dispatch({ type: 'RESOLVE_COMBAT', territory })
      }
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


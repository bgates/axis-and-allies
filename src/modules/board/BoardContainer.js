import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import Board from './Board'
import { 
  overlayPhase,
  advanceButtonPhase,
  mergeBoardAndTerritories, 
  getCurrentPower
} from './selectors'

const mapStateToProps = (state) => {
  return {
    board: mergeBoardAndTerritories(state),
    phase: state.phase,
    hasOverlay: overlayPhase(state),
    advanceBtn: advanceButtonPhase(state),
    currentPower: getCurrentPower(state),
  }
}

const damagedShips = (territories, power) => {
  return territories.length > 0
}

const getFriendlyHarbor = (board, power) => {
  return board.filter(territory => territory.seaPort && territory.currentPower === power.name)
}

const damagedShipsInHarbor = (board, power) => {
   return damagedShips(getFriendlyHarbor(board, power))
}

const territoryThunk = (territory) => {
  return (dispatch, getState) => {
    let state = getState()
    if (overlayPhase(state)) {
      return
    }
    let { board, router, phase } = state 
    let currentPower = getCurrentPower(state)
    if (phase.current === 'start') {
      let nextUrl = damagedShipsInHarbor(board, currentPower) ? 'repair' : 'research'
      dispatch(push(nextUrl))

    } else if (router.location.pathname === '/plan-combat') {
      dispatch({ type: 'PLAN_ATTACK', territory })
    } else if (router.location.pathname === '/resolve-combat') {
      // need logic to prevent dispatch if no combat
      dispatch({ type: 'RESOLVE_COMBAT', territory })
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


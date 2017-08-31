import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import Board from './components/Board'
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
  planMovement,
  orderUnits
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

const territoryThunk = (territory) => {
  return (dispatch, getState) => {
    const state = getState()
    if (overlayPhase(state)) {
      return
    }
    const { router } = state 
    switch (router.location.pathname) {
      case '/': {
        const nextUrl = hasDamagedShipsInHarbor(state) ? 'repair' : 'research'
        dispatch(push(nextUrl)) 
      } 
      case '/plan-combat': {
        dispatch(planAttack(territory))
      } 
      case '/resolve-combat': {
        // need logic to prevent dispatch if no combat
        if (territory.unitsFrom.length && territory.units.length) {
          dispatch(resolveCombat(territory))
        }
      } 
      case '/land-planes': {
        if (territory.newlyConquered && territory.units.filter(u => u.air).length) {
          dispatch(planLandPlanes(territory))
        }
      } 
      case '/move-units': {
        dispatch(planMovement(territory))
      } 
      case '/order-units': {
        dispatch(orderUnits(territory)) 
      } 
      default:  
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


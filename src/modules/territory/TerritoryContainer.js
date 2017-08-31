import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import Territory from './Territory'
import { getFill, getClasses } from './selectors'
import { getCurrentPower } from '../../selectors/getCurrentPower'
import { hasDamagedShipsInHarbor } from '../repair'
import { overlayPhase } from '../board'
import { 
  planAttack, 
  resolveCombat, 
  planLandPlanes,
  planMovement,
  orderUnits
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
    handleClick: bindActionCreators(territoryThunk, dispatch)
  }
}

const TerritoryContainer = connect(mapStateToProps, mapDispatchToProps)(Territory)

export default TerritoryContainer

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { 
  getCurrentPower, 
  getFocusTerritory, 
  unitsInRange,
  occupants 
} from './selectors'
import MovementModal from './MovementModal'
import { PLAN_MOVEMENT } from '../../actions'

const mapStateToProps = (state) => (  
  {
    currentPower: getCurrentPower(state),
    territory: getFocusTerritory(state),
    unitsInRange: unitsInRange(state),
    occupants: occupants(state)
  } 
)

const planOtherMovement = () => {
  return {
    type: PLAN_MOVEMENT
  }
}

const mapDispatchToProps = (dispatch) => (
  bindActionCreators({ 
    planOtherMovement
  }, dispatch)
)

const MovementContainer = connect(mapStateToProps, mapDispatchToProps)(MovementModal)

export default MovementContainer


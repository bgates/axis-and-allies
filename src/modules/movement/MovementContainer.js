import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { 
  getCommittedIds,
  getCurrentPower, 
  getFocusTerritory, 
  territoryLandingSlots,
  unitsInRange,
  combinedCombatants
} from './selectors'
import MovementModal from './MovementModal'
import { PLAN_MOVEMENT } from '../../actions'

const mapStateToProps = (state) => (  
  {
    committed: getCommittedIds(state),
    currentPower: getCurrentPower(state),
    landingSlots: territoryLandingSlots(state),
    territory: getFocusTerritory(state),
    unitsInRange: unitsInRange(state),
    occupants: combinedCombatants(state, state.phase.territoryIndex)
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


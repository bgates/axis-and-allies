import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { LoadTransportContainer } from '../loadTransport'
import { 
  getCommittedIds,
  getCurrentPower, 
  getFocusTerritory, 
  territoryLandingSlots,
  unitsInRange,
  combinedCombatants
} from './selectors'
import MovementModal from './MovementModal'
import { PLAN_MOVEMENT, VIEW_TRANSPORT_LOAD_OPTIONS } from '../../actions'

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

const RealMovementContainer = connect(mapStateToProps, mapDispatchToProps)(MovementModal)

const outerMapStateToProps = (state) => ({
  phase: state.phase
})

const OuterMovementModal = (props) => {
  if (props.phase.current === VIEW_TRANSPORT_LOAD_OPTIONS) {
    return <LoadTransportContainer />
  } else {
    return <RealMovementContainer />
  }
}

const MovementContainer = connect(outerMapStateToProps)(OuterMovementModal)

export default MovementContainer


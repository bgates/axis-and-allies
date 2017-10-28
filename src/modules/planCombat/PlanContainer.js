import React from 'react'
import { connect } from 'react-redux'
import PlanCombatContainer from './PlanCombatContainer'
import LoadTransportContainer from '../loadTransport/LoadTransportContainer'
import { VIEW_TRANSPORT_LOAD_OPTIONS } from '../../actions'

const mapStateToProps = (state) => ({
  phase: state.phase
})

const PlanModal = ({ phase }) => {
  if (phase.current === VIEW_TRANSPORT_LOAD_OPTIONS) {
    return <LoadTransportContainer />
  } else {
    return <PlanCombatContainer />
  }
}

const PlanContainer = connect(mapStateToProps)(PlanModal)

export default PlanContainer


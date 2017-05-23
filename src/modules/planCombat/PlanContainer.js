import React from 'react';
import { connect } from 'react-redux';
import PlanCombatContainer from './PlanCombatContainer';
import LoadTransportContainer from '../loadTransport/LoadTransportContainer';

const mapStateToProps = (state) => ({
  phase: state.phase
})

const PlanModal = ({ phase }) => {
  if (phase.current === 'plan-attack') {
    return <PlanCombatContainer />
  } else {
    return <LoadTransportContainer />
  }
}

const PlanContainer = connect(mapStateToProps)(PlanModal)

export default PlanContainer


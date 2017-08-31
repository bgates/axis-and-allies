import React from 'react';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { phases } from '../selectors';
import {
  SELECT_PLANE_LANDING_TERRITORY,
  LAND_PLANES
} from '../../../actions';

const mapStateToProps = (state) => ({
  phase: state.phase.current,
  phases: phases(state)
})

const advancePhase = () => {
  return (dispatch, getState) => {
    const state = getState()
    dispatch({ type: LAND_PLANES, planesFrom: state.landPlanes })
    dispatch(push('/move-units'))
  }
}

const previousPhase = () => {
  return { type: SELECT_PLANE_LANDING_TERRITORY }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ 
    advancePhase,
    previousPhase
  }, dispatch)
}

// the advance button won't allow forward progress during resolve-combat if any combat is unresolved, and won't allow back movement if any combat has begun.
const NavLinks = ({ fwd, back, text }) => {
  return (
    <div className="changePhase">
      <Link to={fwd} className="btn">{text || 'Done'}</Link>
      <Link to={back} className="btn">Back</Link>
    </div>
  )
}

const AdvanceButtonComponent = ({ phase, phases, advancePhase, previousPhase }) => {
  if (['plan-combat', 'resolve-combat', 'move-units', 'order-units'].includes(phase)) {
    return <NavLinks fwd={phases.next} back={phases.last} text={phases.text} />
  } else {
    return (
      <div className="changePhase">
        <button className="btn" onClick={advancePhase}>Done</button>
        <button className="btn" onClick={previousPhase}>Back</button>
      </div>
    )
  }
}
const AdvanceButton = connect(mapStateToProps, mapDispatchToProps)(AdvanceButtonComponent)

export default AdvanceButton


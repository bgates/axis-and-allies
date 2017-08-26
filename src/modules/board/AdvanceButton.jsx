import React from 'react';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import {
  SELECT_PLANE_LANDING_TERRITORY,
  LAND_PLANES
} from '../../actions';

const mapStateToProps = (state) => ({
  phase: state.phase.current
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
const AdvanceButtonComponent = ({ phase, advancePhase, previousPhase }) => {
  if (['plan-combat', 'resolve-combat'].includes(phase)) {
    return (
      <div className="changePhase">
        <Link to="resolve-combat" className="btn">Done</Link>
        <Link to="income" className="btn">Back</Link>
      </div>
    )
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


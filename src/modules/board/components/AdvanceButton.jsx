import React from 'react';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { phases } from '../selectors';
import {
  SELECT_PLANE_LANDING_TERRITORY,
  LAND_PLANES,
  NEXT_TURN 
} from '../../../actions';

const mapStateToProps = (state) => ({
  phases: phases(state)
})

const changePhaseThunk = (dir = 'fwd') => {
  return (dispatch, getState) => {
    const state = getState()
    const { phase } = state 
    const phases = {
      'confirm-land-planes-fwd': () => {
        dispatch({ type: LAND_PLANES, planesFrom: state.landPlanes })
        dispatch(push('/move-units'))
      },
      'confirm-land-planes-back': () => dispatch({ type: SELECT_PLANE_LANDING_TERRITORY }),
      'confirm-finish-fwd': () => {
        dispatch({ type: NEXT_TURN })
        dispatch(push('/'))
      },
      'confirm-finish-back': () => dispatch({ type: 'backToOrder' })
    }
    return phases[`${phase.current}-${dir}`]()
  }
}

const advancePhase = () => changePhaseThunk()
const regressPhase = () => changePhaseThunk('back')

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ 
    advancePhase,
    regressPhase,
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

const AdvanceButtonComponent = ({ phases, advancePhase, previousPhase }) => {
  if (typeof phases.next === 'string') {
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


import React from 'react';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
  phase: state.phase.current,
})

const advancePhase = () => {
  return ({
    type: 'RESOLVE_COMBAT'
  })
}

const previousPhase = () => {
  return ({
    type: ''
  })
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ 
    advancePhase
  }, dispatch)
}

// the advance button won't allow forward progress during resolve-combat if any combat is unresolved, and won't allow back movement if any combat has begun.
const AdvanceButtonComponent = ({ phase, advancePhase, previousPhase }) => {
  return (
    <div className="changePhase">
      <Link to="resolve-combat">Done</Link>
      <Link to="income">Back</Link>
      <button onClick={advancePhase}>Done</button>
      <button onClick={previousPhase}>Back</button>
    </div>
  )
}
const AdvanceButton = connect(mapStateToProps, mapDispatchToProps)(AdvanceButtonComponent)

export default AdvanceButton


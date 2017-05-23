import React from 'react';
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

const AdvanceButtonComponent = ({ phase, advancePhase, previousPhase }) => {
  return (
    <div className="changePhase">
      <button onClick={advancePhase}>Done</button>
      <button onClick={previousPhase}>Back</button>
    </div>
  )
}
const AdvanceButton = connect(mapStateToProps, mapDispatchToProps)(AdvanceButtonComponent)

export default AdvanceButton


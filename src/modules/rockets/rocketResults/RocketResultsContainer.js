import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import RocketResultsModal from './RocketResultsModal'
import { targetValues, damages } from './selectors'
import { ASSESS_ROCKET_DAMAGE } from '../../../actions'
import PATHS from '../../../paths'

const mapStateToProps = (state) => ({
  targetValues: targetValues(state),
  damages: damages(state),
  rolls: state.rolls[PATHS.ROCKET_RESULTS]
})

const advancePhase = (damages) => {
  return (dispatch) => {
    dispatch({ type: ASSESS_ROCKET_DAMAGE, damages })
    dispatch(push(PATHS.PURCHASE))
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ 
    advancePhase
  }, dispatch)
}

const RocketResultsContainer = connect(mapStateToProps, mapDispatchToProps)(RocketResultsModal)

export default RocketResultsContainer


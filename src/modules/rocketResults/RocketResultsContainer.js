import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import RocketResultsModal from './RocketResultsModal'
import { targetValues, damages } from './selectors'
import PATHS from '../../paths'

const mapStateToProps = (state) => ({
  targetValues: targetValues(state),
  damages: damages(state),
  rolls: state.rolls[PATHS.ROCKET_RESULTS]
})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ 
    //launchRockets
  }, dispatch)
}

const RocketResultsContainer = connect(mapStateToProps, mapDispatchToProps)(RocketResultsModal)

export default RocketResultsContainer


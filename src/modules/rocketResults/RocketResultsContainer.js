import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import RocketResultsModal from './RocketResultsModal'
import { rocketTargets } from '../rocketAttack'
import { previousPhase } from '../../selectors/previousPhase'
import { SET_ROCKET_TARGET, roll } from '../../actions'
import PATHS from '../../paths'

const mapStateToProps = (state) => ({
  rocketsAndTargets: rocketTargets(state),
  previous: previousPhase(state),
})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ 
    rocketsAndTargets,
    launchRockets
  }, dispatch)
}

const RocketResultsContainer = connect(mapStateToProps, mapDispatchToProps)(RocketResultsModal)

export default RocketResultsContainer

//I gotta get the territories and their ipc values, assign die rolls to the targets, figure out where the cap is

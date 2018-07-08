import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import RocketAttackModal from './RocketAttackModal'
import { rocketTargets, getSelectedRocketTargets } from './selectors'
import { previousPhase } from '../../../../selectors/phase'
import dice from '../../../../lib/numericalDieRolls'
import { SET_ROCKET_TARGET, roll } from '../../../../actions'
import PATHS from '../../../../paths'

const mapStateToProps = (state) => ({
  rocketsAndTargets: rocketTargets(state),
  previous: previousPhase(state),
  selected: getSelectedRocketTargets(state)
})

const setTarget = (launchSite, target) => (
  { type: SET_ROCKET_TARGET, launchSite, target }
)

const launchRockets = () => (
  (dispatch, getState) => {
    const { rocketTargets } = getState()
    const rolls = dice(Object.keys(rocketTargets).length)
    dispatch(roll(PATHS.ROCKET_RESULTS, rolls))
    dispatch(push(PATHS.ROCKET_RESULTS))
  }
)

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ 
    setTarget,
    launchRockets
  }, dispatch)
}

const RocketAttackContainer = connect(mapStateToProps, mapDispatchToProps)(RocketAttackModal)

export default RocketAttackContainer


import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { combatRolls, strengths } from './selectors'
import CombatRollsModal from './CombatRollsModal'
import PATHS from '../../../paths'

const mapStateToProps = (state) => {
  return {
    rolls: combatRolls(state),
    strengths: strengths(state)
  }
}

const selectCasualties = () => {
  return (dispatch) => {
    dispatch(push(PATHS.SELECT_CASUALTIES))
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ 
    selectCasualties
  }, dispatch)
}

const CombatRollsContainer = connect(mapStateToProps, mapDispatchToProps)(CombatRollsModal)

export default CombatRollsContainer

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { combatRolls, strengths } from './selectors';
import CombatRollsModal from './CombatRollsModal';

const mapStateToProps = (state) => {
  return {
    rolls: combatRolls(state),
    strengths: strengths(state)
  }
}

const selectCasualties = () => {
  return (dispatch) => {
    dispatch(push('select-casualties'))
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ 
    selectCasualties
  }, dispatch)
}

const CombatRollsContainer = connect(mapStateToProps, mapDispatchToProps)(CombatRollsModal)

export default CombatRollsContainer

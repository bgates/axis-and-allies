import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { combatRolls } from './selectors';
import { strengths } from '../combat/selectors';
import CombatRollsModal from './CombatRollsModal';

const mapStateToProps = (state) => {
  return {
    rolls: combatRolls(state),
    strengths: strengths(state)
  }
}

const returnToCombat = () => {
  return (dispatch) => {
    dispatch(push('resolve-combat'))
    dispatch({ type: 'RESOLVE_COMBAT' })
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ 
    returnToCombat
  }, dispatch)
}

const CombatRollsContainer = connect(mapStateToProps, mapDispatchToProps)(CombatRollsModal)

export default CombatRollsContainer

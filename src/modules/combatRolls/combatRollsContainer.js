import { connect } from 'react-redux';
import { combatRolls } from './selectors';
import { strengths } from '../combat/selectors'
import CombatRollsModal from './CombatRollsModal';

const mapStateToProps = (state) => {
  return {
    rolls: combatRolls(state),
    strengths: strengths(state)
  }
}

const CombatRollsContainer = connect(mapStateToProps)(CombatRollsModal)

export default CombatRollsContainer

import { connect } from 'react-redux';
import RocketAttackModal from './RocketAttackModal';
import { rocketTargets } from './selectors';
import { previousPhase } from '../../selectors/previousPhase';

const mapStateToProps = (state) => ({
  targets: rocketTargets(state),
  previous: previousPhase(state)
});

const RocketAttackContainer = connect(mapStateToProps)(RocketAttackModal)

export default RocketAttackContainer


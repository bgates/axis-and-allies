import { connect } from 'react-redux';
import RocketAttackModal from './RocketAttackModal';
import { rocketTargets } from './selectors';

const mapStateToProps = (state) => ({
  targets: rocketTargets(state)
});

const RocketAttackContainer = connect(mapStateToProps)(RocketAttackModal)

export default RocketAttackContainer


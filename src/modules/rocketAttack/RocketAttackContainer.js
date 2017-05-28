import { connect } from 'react-redux';
import RocketAttackModal from './RocketAttackModal';
import { IndustrialComplexInRocketRange } from './selectors';

const mapStateToProps = (state) => ({
  targets: IndustrialComplexInRocketRange(state)
});

const RocketAttackContainer = connect(mapStateToProps)(RocketAttackModal)

export default RocketAttackContainer


import { connect } from 'react-redux'
import IncomeModal from './IncomeModal'
import { getCurrentPower } from '../../selectors/getCurrentPower';
import { nationalObjectives, currentPowerNPL, nextNPL } from './selectors'

const mapStateToProps = (state) => ({
  currentPower: getCurrentPower(state),
  objectives: nationalObjectives(state),
  npl: currentPowerNPL(state),
  nextNpl: nextNPL(state)
})

const IncomeContainer = connect(mapStateToProps)(IncomeModal)

export default IncomeContainer


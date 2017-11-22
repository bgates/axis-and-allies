import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import IncomeModal from './IncomeModal'
import { getCurrentPower } from '../../selectors/getCurrentPower'
import { nationalObjectives, currentPowerNPL, nextNPL } from './selectors'
import { SET_INCOME } from '../../actions'

const mapStateToProps = (state) => ({
  currentPower: getCurrentPower(state),
  objectives: nationalObjectives(state),
  npl: currentPowerNPL(state),
  nextNpl: nextNPL(state),
  income: state.income
})

const setIncome = () => {
  return (dispatch, getState) => {
    const state = getState()
    dispatch({ type: SET_INCOME, amount: currentPowerNPL(state) })
  }
}

const mapDispatchToProps = (dispatch) => (
  bindActionCreators({ 
    setIncome
  }, dispatch)
)

const IncomeContainer = connect(mapStateToProps, mapDispatchToProps)(IncomeModal)

export default IncomeContainer


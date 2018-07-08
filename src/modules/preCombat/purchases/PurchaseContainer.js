import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PurchaseModal from './PurchaseModal'
import { purchaseCost, buildableUnits, getCurrentPower } from './selectors'
import { previousPhase } from '../../../selectors/phase'

const mapStateToProps = (state) => ({
  currentPower: getCurrentPower(state).name,
  budget: getCurrentPower(state).ipc,
  buildableUnits: buildableUnits(state),
  purchases: state.purchases,
  total: purchaseCost(state),
  previous: previousPhase(state)
})

const increment = (unit) => {
  return (dispatch, getState) => {
    const state = getState()
    const { currentPowerIndex } = state
    dispatch({ type: 'INCREMENT_PURCHASE', unit, currentPowerIndex })
  }
}

const decrement = (unit) => {
  return (dispatch, getState) => {
    const state = getState()
    const { currentPowerIndex } = state
    dispatch({ type: 'DECREMENT_PURCHASE', unit, currentPowerIndex })
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ 
    increment, 
    decrement 
  }, dispatch)
}

const PurchaseContainer = connect(mapStateToProps, mapDispatchToProps)(PurchaseModal)

export default PurchaseContainer


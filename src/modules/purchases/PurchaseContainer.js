import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PurchaseModal from './PurchaseModal'
import { purchaseCost, buildableUnits, getCurrentPower } from './selectors'
import { previousPhase } from '../../selectors/previousPhase';

const mapStateToProps = (state) => ({
  currentPower: getCurrentPower(state).name,
  budget: getCurrentPower(state).ipc,
  buildableUnits: buildableUnits(state),
  purchases: state.purchases,
  total: purchaseCost(state),
  previous: previousPhase(state)
})

const increment = (unit) => {
  return {
    type: 'INCREMENT_PURCHASE',
    unit
  }
}

const decrement = (unit) => {
  return {
    type: 'DECREMENT_PURCHASE',
    unit
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


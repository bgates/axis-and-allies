import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PlanCombatModal from './PlanCombatModal'
import { getCurrentPower, getFocusTerritory, unitsInRange, combatants } from './selectors'

const mapStateToProps = (state) => ({
  currentPower: getCurrentPower(state),
  territory: getFocusTerritory(state),
  unitsInRange: unitsInRange(state),
  combatants: combatants(state)
})

const planOtherAttack = () => {
  return {
    type: 'PLAN_COMBAT'
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ 
    planOtherAttack
  }, dispatch)
}

const PlanCombatContainer = connect(mapStateToProps, mapDispatchToProps)(PlanCombatModal)

export default PlanCombatContainer


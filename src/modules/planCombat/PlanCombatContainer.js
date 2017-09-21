import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PlanCombatModal from './PlanCombatModal'
import { 
  getCurrentPower, 
  getFocusTerritory, 
  unitsInRange, 
  combatants,
  landingSlots
} from './selectors'
import { PLAN_ATTACKS } from '../../actions'

const mapStateToProps = (state) => ({
  currentPower: getCurrentPower(state),
  territory: getFocusTerritory(state),
  unitsInRange: unitsInRange(state),
  combatants: combatants(state),
  landingSlots: landingSlots(state)
})

const planOtherAttack = () => {
  return {
    type: PLAN_ATTACKS
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ 
    planOtherAttack
  }, dispatch)
}

const PlanCombatContainer = connect(mapStateToProps, mapDispatchToProps)(PlanCombatModal)

export default PlanCombatContainer


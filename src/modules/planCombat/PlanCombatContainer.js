import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PlanCombatModal from './PlanCombatModal'
import { 
  combinedCombatants,
  getCurrentPower, 
  getFocusTerritory, 
  getCommittedIds,
  hasIndustrialComplex,
  strategicBombing,
  territoryLandingSlots,
  unitsInRange, 
} from './selectors'
import { PLAN_ATTACKS } from '../../actions'

const mapStateToProps = (state) => ({
  combatants: combinedCombatants(state),
  committed: getCommittedIds(state),
  currentPower: getCurrentPower(state),
  hasIndustry: hasIndustrialComplex(state),
  landingSlots: territoryLandingSlots(state),
  strategicBombing: strategicBombing(state),
  territory: getFocusTerritory(state),
  unitsInRange: unitsInRange(state)
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


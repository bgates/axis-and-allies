import { connect } from 'react-redux'
import CombatModal from './CombatModal'
import { combatants } from '../planCombat'

const mapStateToProps = (state) => ({
  combatants: combatants(state)
})

const CombatContainer = connect(mapStateToProps)(CombatModal)

export default CombatContainer

// I want to see which of these units have been hit;the territory should track that

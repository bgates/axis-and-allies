import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import CombatModal from './CombatModal'
import { combatants } from '../planCombat'
import { strengths, rollCount } from './selectors'
import dice from '../../lib/numericalDieRolls'

const mapStateToProps = (state) => ({
  combatants: combatants(state),
  strengths: strengths(state),
  rollCount: rollCount(state)
})

const rollForCombat = (combatantCount) => {
  return (dispatch, getState) => {
    let rolls = dice(combatantCount)
    dispatch({
      type: 'ROLLS',
      rolls
    })
    dispatch({
      type: 'SET_MINIMUM_PHASE',
      phase: '/resolve-combat'
    })
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ 
    rollForCombat, 
  }, dispatch)
}

const CombatContainer = connect(mapStateToProps, mapDispatchToProps)(CombatModal)

export default CombatContainer

// I want to see which of these units have been hit;the territory should track that

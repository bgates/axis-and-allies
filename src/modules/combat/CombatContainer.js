import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import CombatModal from './CombatModal'
import { combatants } from '../planCombat'
import { rollCount } from './selectors'
import { combatRolls, strengths, defenderCasualties } from '../combatRolls'
import dice from '../../lib/numericalDieRolls'

const mapStateToProps = (state) => ({
  combatants: combatants(state),
  strengths: strengths(state),
  rollCount: rollCount(state),
  rolls: combatRolls(state),
  casualties: defenderCasualties(state)
})

const rollForCombat = (combatantCount) => {
  return (dispatch) => {
    let rolls = dice(combatantCount)
    dispatch({
      type: 'ROLLS',
      phase: '/combat-rolls',
      rolls
    })
    dispatch(push('combat-rolls'))
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

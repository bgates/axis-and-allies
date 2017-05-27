import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import CombatModal from './CombatModal'
import { combatants } from '../planCombat'
import { rolls } from './selectors'
import dice from '../../lib/numericalDieRolls'

const mapStateToProps = (state) => ({
  combatants: combatants(state),
  strengths: rolls(state)
})

const rollForCombat = (playerCount, opponentCount) => {
  console.log(playerCount, opponentCount)
  return (dispatch, getState) => {
    let playerRolls = dice(playerCount)
    let opponentRolls = dice(opponentCount)
    dispatch({
      type: 'ROLLS',
      playerRolls,
      opponentRolls
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

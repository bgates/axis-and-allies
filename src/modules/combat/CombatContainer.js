import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import CombatModal from './CombatModal'
import { combatants } from '../planCombat'
import { rollCount, getFocusTerritory, attackerCasualties } from './selectors'
import { strengths, defenderCasualties, attackerCasualtyCount } from '../combatRolls'
import { getCurrentPower } from '../../selectors/getCurrentPower'
import { removeCasualties, roll } from '../../actions';
import dice from '../../lib/numericalDieRolls'
import PATHS from '../../paths'

const mapStateToProps = (state) => ({
  territory: getFocusTerritory(state),
  combatants: combatants(state),
  strengths: strengths(state),
  defenderCasualties: defenderCasualties(state),
  attackerCasualties: attackerCasualties(state),
  attackerCasualtyCount: attackerCasualtyCount(state)
})

const rollForCombat = (territoryIndex) => {
  return (dispatch, getState) => {
    const state = getState();
    dispatch(removeCasualties(defenderCasualties(state), territoryIndex, getCurrentPower(state).name))
    const rolls = dice(rollCount(getState()));
    dispatch(roll(PATHS.COMBAT_ROLLS, rolls))
    dispatch(push(PATHS.COMBAT_ROLLS));
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ 
    rollForCombat 
  }, dispatch)
}

const CombatContainer = connect(mapStateToProps, mapDispatchToProps)(CombatModal)

export default CombatContainer


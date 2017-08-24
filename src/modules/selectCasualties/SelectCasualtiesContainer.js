import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import SelectCasualtiesModal from './SelectCasualtiesModal'
import { combatants } from '../planCombat'
import { 
  getFocusTerritory, 
  attackerCasualties, 
  victor, 
  attackDefeated,
  combatOver,
  planesInAir
} from './selectors'
import { strengths, defenderCasualties, attackerCasualtyCount } from '../combatRolls'
import { getCurrentPower } from '../../selectors/getCurrentPower';
import { resolveCombat, LOSE_ATTACK, winAttack } from '../../actions';

const mapStateToProps = (state) => ({
  territory: getFocusTerritory(state),
  combatants: combatants(state),
  strengths: strengths(state),
  defenderCasualties: defenderCasualties(state),
  attackerCasualties: attackerCasualties(state),
  attackerCasualtyCount: attackerCasualtyCount(state),
  attackDefeated: attackDefeated(state),
  victor: victor(state)
})

const toggleCasualtyStatus = (id, territoryIndex) => {
  return (dispatch) => {
    dispatch({
      type: 'TOGGLE_CASUALTY',
      id,
      territoryIndex
    })
  }
}

const nextStep = (victor, territoryIndex) => {
  if (victor === 'attacker') {
    return attackerWins(territoryIndex)
  } else if (victor === 'defender') {
    return defenderWins(territoryIndex)
  } else {
    return continueCombat()
  }
}

const attackerWins = (territoryIndex) => {
  return (dispatch, getState) => {
    let state = getState();
    dispatch(winAttack(territoryIndex, getCurrentPower(state).name))
    state = getState();
    continueOrAdvancePhase(dispatch, state)
  }
}

const defenderWins = (territoryIndex) => {
  return (dispatch, getState) => {
    let state = getState();
    dispatch({
      type: LOSE_ATTACK,
      territoryIndex,
      defenderCasualties: defenderCasualties(state)
    })
    state = getState();
    continueOrAdvancePhase(dispatch, state)
  }
}

const continueCombat = () => {
  return (dispatch) => {
    dispatch(push('/resolve-combat'))
    dispatch(resolveCombat())
  }
}

const continueOrAdvancePhase = (dispatch, state) => {
  if (combatOver(state)) {
    if (planesInAir(state)) {
      dispatch(push('/land-planes'))
    } else {
      dispatch(push('/noncombat-movement'))
    }
  } else {
    dispatch(push('/resolve-combat'))
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ 
    toggleCasualtyStatus,
    nextStep
  }, dispatch)
}

const SelectCasualtiesContainer = connect(mapStateToProps, mapDispatchToProps)(SelectCasualtiesModal)

export default SelectCasualtiesContainer


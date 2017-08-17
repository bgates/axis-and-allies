import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import SelectCasualtiesModal from './SelectCasualtiesModal'
import { combatants } from '../planCombat'
import { getFocusTerritory, attackerCasualties, victor, attackDefeated } from './selectors'
import { strengths, defenderCasualties, attackerCasualtyCount } from '../combatRolls'
import { getCurrentPower } from '../../selectors/getCurrentPower';

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
    return removeCasualties
  }
}

const attackerWins = (territoryIndex) => {
  return (dispatch, getState) => {
    const state = getState();
    dispatch({
      type: 'ATTACKER_WINS',
      territoryIndex,
      currentPower: getCurrentPower(state).name
    })
    dispatch(push('/resolve-combat'))
  }
}

const defenderWins = (territoryIndex) => {
  return (dispatch, getState) => {
    const state = getState()
    dispatch({
      type: 'DEFENDER_WINS',
      territoryIndex,
      defenderCasualties: defenderCasualties(state)
    })
    dispatch(push('/resolve-combat'))
  }
}

const removeCasualties = (dispatch) => {
  return (dispatch) => {
    dispatch(push('/resolve-combat'))
    dispatch({ type: 'RESOLVE_COMBAT' })
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


import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import SelectCasualtiesModal from './SelectCasualtiesModal'
import { planesInAir } from '../landPlanes'
import { bombRaid, isBombed } from '../territory'

import { 
  getFocusTerritory, 
  attackerCasualties, 
  combatants,
  victor, 
  attackDefeated,
  isConquered,
  isDogfight
} from './selectors'
import { noCombat } from '../board'
import { strengths, defenderCasualties, attackerCasualtyCount } from '../combat'
import { getCurrentPowerName } from '../../selectors/getCurrentPower'
import { 
  resolveCombat, 
  TOGGLE_CASUALTY,
  LOSE_ATTACK, 
  winAttack 
} from '../../actions'

const mapStateToProps = (state) => ({
  territory: getFocusTerritory(state),
  dogfight: isDogfight(state),
  combatants: combatants(state),
  strengths: strengths(state),
  defenderCasualties: defenderCasualties(state),
  attackerCasualties: attackerCasualties(state),
  attackerCasualtyCount: attackerCasualtyCount(state),
  attackDefeated: attackDefeated(state),
  victor: victor(state),
  conquered: isConquered(state)
})

const toggleCasualtyStatus = id => dispatch => dispatch({ type: TOGGLE_CASUALTY, id })

const nextStep = (victor, territoryIndex, dogfight) => {
  if (dogfight) {
    return postDogfight(territoryIndex)
  } else if (victor === 'attacker') {
    return attackerWins(territoryIndex)
  } else if (victor === 'defender') {
    return defenderWins(territoryIndex)
  } else {
    return continueCombat()
  }
}

const attackerWins = (territoryIndex) => {
  return (dispatch, getState) => {
    let state = getState()
    const { defenders } = combatants(state)
    const casualties = attackerCasualties(state)
    const conqueringPower = isConquered(state) ? getCurrentPowerName(state) : null
    dispatch(winAttack(territoryIndex, defenders.map(u => u.id), casualties, conqueringPower))
    state = getState()
    continueOrAdvancePhase(dispatch, state)
  }
}

const defenderWins = (territoryIndex) => {
  return (dispatch, getState) => {
    let state = getState()
    dispatch({
      type: LOSE_ATTACK,
      territoryIndex,
      attackerCasualties: combatants(state).attackers.map(u => u.id),
      defenderCasualties: defenderCasualties(state)
    })
    state = getState()
    continueOrAdvancePhase(dispatch, state)
  }
}

const continueCombat = () => {
  return (dispatch, getState) => {
    const state = getState()
    const territory = getFocusTerritory(state)
    dispatch(push('resolve-combat'))
    dispatch(resolveCombat(territory.index))
  }
}

const postDogfight = (territoryIndex) => {
  return (dispatch, getState) => {
    const territory = getFocusTerritory(getState())
    if (isBombed(territory)) {
      return bombRaid(dispatch, territory)
    } else if (territory) {
      // if combat, have it out
    }
    
  }
}
export const continueOrAdvancePhase = (dispatch, state) => {
  if (noCombat(state)) {
    if (planesInAir(state)) {
      dispatch(push('land-planes'))
    } else {
      dispatch(push('plan-movement'))
    }
  } else {
    dispatch(push('resolve-combat'))
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


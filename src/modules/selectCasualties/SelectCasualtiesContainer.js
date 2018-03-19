import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import SelectCasualtiesModal from './SelectCasualtiesModal'
import { 
  airCasualties,
  casualtyCount,
  defenderCasualties,
  getFocusTerritory, 
  getAttackerCasualties, 
  bombardingUnits,
  getFlights,
  combatants,
  victor, 
  attackDefeated,
  isConquered,
  isDogfight,
  planesInAir,
  bombRaid,
  isBombed,
  isCombat,
  noCombat,
  strengths,
} from './selectors'
import { getCurrentPowerName } from '../../selectors/getCurrentPower'
import { 
  resolveCombat, 
  TOGGLE_CASUALTY,
  loseAttack, 
  winAttack 
} from '../../actions'

const mapStateToProps = (state) => {
  const _attackDefeated = attackDefeated(state)
  const attackerCasualties = getAttackerCasualties(state)
  const _bombardingUnits = bombardingUnits(state)
  const classNameFct = id => {
    if (_bombardingUnits.includes(id)) {
      return null
    }
    return _attackDefeated || attackerCasualties.includes(id) ? 'casualty' : null
  }
  return {
    territory: getFocusTerritory(state),
    dogfight: isDogfight(state),
    combatants: combatants(state),
    strengths: strengths(state),
    defenderCasualties: defenderCasualties(state),
    attackerCasualties,
    classNameFct,
    airCasualties: airCasualties(state),
    casualtyCount: casualtyCount(state),
    attackDefeated: _attackDefeated,
    victor: victor(state),
    conquered: isConquered(state)
  }
}
const toggleCasualtyStatus = id => dispatch => dispatch({ type: TOGGLE_CASUALTY, id })

const nextStep = (victor, territoryIndex, dogfight) => {
  if (dogfight) {
    return postDogfight(territoryIndex, victor)
  } else if (victor === 'attacker') {
    return attackerWins(territoryIndex)
  } else if (victor === 'defender') {
    return defenderWins(territoryIndex)
  } else {
    return continueCombat()
  }
}

const id = unit => unit.id
const attackerWins = (territoryIndex) => {
  return (dispatch, getState) => {
    let state = getState()
    const { attackers, defenders } = combatants(state)
    const casualties = getAttackerCasualties(state)
    const survivors = attackers.map(id).filter(id => !casualties.includes(id))
    const conqueringPower = isConquered(state) ? getCurrentPowerName(state) : null
    const airUnits = getFlights(state)
    dispatch(winAttack(territoryIndex, defenders.map(id), survivors, airUnits, casualties, conqueringPower))
    state = getState()
    continueOrAdvancePhase(dispatch, state)
  }
}

const defenderWins = (territoryIndex) => {
  return (dispatch, getState) => {
    let state = getState()
    dispatch(loseAttack(territoryIndex, combatants(state).attackers.map(id), defenderCasualties(state)))
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

const postDogfight = (territoryIndex, victor) => {
  return (dispatch, getState) => {
    let state = getState()
    if (victor === 'defender') {
      dispatch(loseAttack(territoryIndex, combatants(state).attackers.map(id), defenderCasualties(state)))
    } else if (victor === 'attacker') {
      console.log('skip, see if it matters')
    }
    state = getState()
    if (isBombed(state, territoryIndex)) {
      return bombRaid(dispatch, state, territoryIndex)
    } else if (isCombat(state, territoryIndex)) {
      console.log('combat continues')
    } else {
      continueOrAdvancePhase(dispatch, state)
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


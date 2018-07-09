import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { nextPhase } from '../../../selectors/phase'
import { getCurrentPowerName } from '../../../selectors/getCurrentPower'
import { getBombedTerritories } from '../../../selectors/stateSlices'
import SelectCasualtiesModal from './SelectCasualtiesModal'
import { 
  airCasualties,
  casualtyCount,
  classNameFct,
  defenderCasualties,
  getFocusTerritory, 
  getAttackerCasualties, 
  getFlights,
  combatants,
  mayClick,
  victor, 
  attackDefeated,
  isConquered,
  isDogfight,
  bombRaid,
  isBombed,
  isCombat,
  strengths,
} from './selectors'
import { 
  enterCombatLifecycle,
  resolveCombat, 
  TOGGLE_CASUALTY,
  dogfightOver,
  strategicDogfightOver,
  loseAttack, 
  winAttack 
} from '../../../actions'
import PATHS from '../../../paths'

const mapStateToProps = (state) => {
  return {
    territory: getFocusTerritory(state),
    dogfight: isDogfight(state),
    combatants: combatants(state),
    strengths: strengths(state),
    defenderCasualties: defenderCasualties(state),
    attackerCasualties: getAttackerCasualties(state),
    classNameFct: classNameFct(state),
    airCasualties: airCasualties(state),
    casualtyCount: casualtyCount(state),
    attackDefeated: attackDefeated(state),
    victor: victor(state),
    conquered: isConquered(state),
    mayClick: mayClick(state)
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
    return continueCombat
  }
}

const id = unit => unit.id
const attackerWins = (territoryIndex) => {
  return (dispatch, getState) => {
    const state = getState()
    const { attackers, defenders } = combatants(state)
    const casualties = getAttackerCasualties(state)
    const survivors = attackers.map(id).filter(id => !casualties.includes(id))
    const conqueringPower = isConquered(state) ? getCurrentPowerName(state) : null
    const airUnits = getFlights(state)
    dispatch(winAttack(territoryIndex, defenders.map(id), survivors, airUnits, casualties, conqueringPower))
    const updatedState = getState()
    dispatch(push(nextPhase(updatedState)))
  }
}

const defenderWins = (territoryIndex) => {
  return (dispatch, getState) => {
    const state = getState()
    dispatch(loseAttack(territoryIndex, combatants(state).attackers.map(id), defenderCasualties(state)))
    const updatedState = getState()
    dispatch(push(nextPhase(updatedState)))
  }
}

const continueCombat = (dispatch, getState) => {
  dispatch(push(PATHS.COMBAT))
}

const postDogfight = (territoryIndex, victor) => {
  return (dispatch, getState) => {
    const state = getState()
    if (getBombedTerritories(state)[territoryIndex]) {
      dispatch(strategicDogfightOver(territoryIndex))
    } else {
      dispatch(dogfightOver(territoryIndex))
    }
    if (victor === 'defender') {
      dispatch(loseAttack(territoryIndex, combatants(state).attackers.map(id), defenderCasualties(state)))
    } 
    dispatch(push(PATHS.COMBAT))
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


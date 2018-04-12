import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { nextPhase } from '../../../selectors/previousPhase'
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
import { getCurrentPowerName } from '../../../selectors/getCurrentPower'
import { 
  resolveCombat, 
  TOGGLE_CASUALTY,
  loseAttack, 
  winAttack 
} from '../../../actions'

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
    let state = getState()
    const { attackers, defenders } = combatants(state)
    const casualties = getAttackerCasualties(state)
    const survivors = attackers.map(id).filter(id => !casualties.includes(id))
    const conqueringPower = isConquered(state) ? getCurrentPowerName(state) : null
    const airUnits = getFlights(state)
    dispatch(winAttack(territoryIndex, defenders.map(id), survivors, airUnits, casualties, conqueringPower))
    state = getState()
    dispatch(push(nextPhase(state)))
  }
}

const defenderWins = (territoryIndex) => {
  return (dispatch, getState) => {
    let state = getState()
    dispatch(loseAttack(territoryIndex, combatants(state).attackers.map(id), defenderCasualties(state)))
    state = getState()
    dispatch(push(nextPhase(state)))
  }
}

const continueCombat = (dispatch, getState) => {
  const state = getState()
  const territory = getFocusTerritory(state)
  dispatch(push('resolve-combat'))
  dispatch(resolveCombat(territory.index))
}

// TODO: this doesn't cover strat bomb dogfight
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
      continueCombat(dispatch, getState)
    } else {
      dispatch(push(nextPhase(state)))
    }
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


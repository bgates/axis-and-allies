import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { getCurrentPower, research, currentPowerHasRockets } from './selectors'
import researchOptions from '../../config/research'
import dice from '../../lib/numericalDieRolls'
import ResearchModal from './ResearchModal'

const mapStateToProps = (state) => {
  return {
    currentPower: getCurrentPower(state),
    hasRockets: currentPowerHasRockets(state),
    research: research(state)
  }
}

const attemptResearch = () => {
  return (dispatch, getState) => {
    let state = getState()
    let { research } = state 
    let currentPower = getCurrentPower(state)
    let playerRolls = dice(research.attempts)
    dispatch({
      type: 'ROLLS',
      playerRolls
    })
    dispatch({
      type: 'ATTEMPT_RESEARCH',
      cost: research.attempts * researchOptions.cost
    })
    if (playerRolls.includes(6)) {
      dispatch({
        type: 'DEVELOP_TECH',
        currentPower,
        tech: research.selectedTech
      })
    }
    dispatch({
      type: 'SET_MINIMUM_PHASE',
      phase: '/research/results'
    })
    dispatch(push('research/results'))
  }
}

const setTech = (tech) => {
  return {
    type: 'SET_TECH',
    tech
  }
}

const incrementResearch = () => {
  return {
    type: 'INCREMENT_RESEARCH'
  }
}

const decrementResearch = () => {
  return {
    type: 'DECREMENT_RESEARCH'
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ 
    setTech, 
    incrementResearch, 
    decrementResearch, 
    attemptResearch 
  }, dispatch)
}

const ResearchContainer = connect(mapStateToProps, mapDispatchToProps)(ResearchModal)

export default ResearchContainer


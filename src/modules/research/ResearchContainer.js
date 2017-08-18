import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { getCurrentPower, research, currentPowerHasRockets } from './selectors'
import researchOptions from '../../config/research'
import dice from '../../lib/numericalDieRolls'
import ResearchModal from './ResearchModal'
import { roll } from '../../actions'

const mapStateToProps = (state) => {
  return {
    currentPower: getCurrentPower(state),
    hasRockets: currentPowerHasRockets(state),
    research: research(state)
  }
}

const attemptResearch = () => {
  return (dispatch, getState) => {
    const state = getState()
    const { research } = state 
    const currentPower = getCurrentPower(state)
    const rolls = dice(research.attempts)
    dispatch(roll('RESEARCH_RESULTS', rolls))
    dispatch({
      type: 'ATTEMPT_RESEARCH',
      cost: research.attempts * researchOptions.cost
    })
    if (rolls.includes(6)) {
      dispatch({
        type: 'DEVELOP_TECH',
        currentPower,
        tech: research.selectedTech
      })
    }
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


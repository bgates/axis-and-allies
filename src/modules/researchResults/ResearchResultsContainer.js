import { connect } from 'react-redux'
import { getCurrentPower } from '../../selectors/getCurrentPower'
import ResearchResultsModal from './ResearchResultsModal'

const mapStateToProps = (state) => {
  return {
    developedTech: state.research.developedTech,
    rolls: state.rolls['/research/results'],
    tech: getCurrentPower(state).tech
  }
}

const ResearchResultsContainer = connect(mapStateToProps)(ResearchResultsModal)

export default ResearchResultsContainer


import { connect } from 'react-redux'
import { getCurrentPower } from '../board/selectors'
import ResearchResultsModal from './ResearchResultsModal'

const mapStateToProps = (state) => {
  return {
    developedTech: state.research.developedTech,
    rolls: state.rolls.research,
    tech: getCurrentPower(state).tech
  }
}

const ResearchResultsContainer = connect(mapStateToProps)(ResearchResultsModal)

export default ResearchResultsContainer


import { connect } from 'react-redux'
import { getCurrentPower } from '../../../../selectors/getCurrentPower'
import ResearchResultsModal from './ResearchResultsModal'
import PATHS from '../../../../paths'

const mapStateToProps = (state) => {
  return {
    developedTech: state.research.developedTech,
    rolls: state.rolls[PATHS.RESEARCH_RESULTS],
    tech: getCurrentPower(state).tech
  }
}

const ResearchResultsContainer = connect(mapStateToProps)(ResearchResultsModal)

export default ResearchResultsContainer


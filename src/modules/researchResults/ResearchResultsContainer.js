import { connect } from 'react-redux'
import { getCurrentPower } from '../board/selectors'
import ResearchResultsModal from './ResearchResultsModal'

const mapStateToProps = (state) => {
  return {
    developedTech: state.researchSpending.developedTech,
    rolls: state.rolls,
    tech: getCurrentPower(state).tech
  }
}

const ResearchResultsContainer = connect(mapStateToProps)(ResearchResultsModal)

export default ResearchResultsContainer


import { compose } from 'redux'
import { connect } from 'react-redux'
import { firebaseConnect } from 'react-redux-firebase'
import Board from './components/Board'
import { 
  overlayPhase,
  advanceButtonPhase,
} from './selectors'
import { getCurrentPower } from '../../selectors/getCurrentPower';
import { mergeBoardAndTerritories } from '../../selectors/mergeBoardAndTerritories';

const mapStateToProps = (state) => {
  return {
    board: mergeBoardAndTerritories(state),
    phase: state.phase,
    router: state.router,
    hasOverlay: overlayPhase(state),
    advanceBtn: advanceButtonPhase(state),
    currentPower: getCurrentPower(state),
    game: state.game
  }
}

const patches = ({ profile: { currentGameId }}) => {
  return [
    { 
      path: `/games/${currentGameId}/patches`, 
      storeAs: 'patches'
    } 
  ]
}

const BoardContainer = compose(
  firebaseConnect(patches),
  connect(mapStateToProps)
)(Board)

export default BoardContainer

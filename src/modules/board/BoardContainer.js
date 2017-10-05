import { connect } from 'react-redux'
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

const BoardContainer = connect(mapStateToProps)(Board)

export default BoardContainer


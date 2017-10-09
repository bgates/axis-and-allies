import { compose } from 'redux'
import { connect } from 'react-redux'
import { firebaseConnect } from 'react-redux-firebase'
import Board from './components/Board'
import { 
  overlayPhase,
  advanceButtonPhase,
} from './selectors'
import { getCurrentPower, isCurrentPower } from '../../selectors/getCurrentPower';
import { mergeBoardAndTerritories } from '../../selectors/mergeBoardAndTerritories';

const mapStateToProps = (state) => {
  return {
    board: mergeBoardAndTerritories(state),
    phase: state.phase,
    router: state.router,
    hasOverlay: overlayPhase(state),
    advanceBtn: advanceButtonPhase(state),
    currentPower: getCurrentPower(state),
    isCurrentPower: isCurrentPower(state)
  }
}

const topLevel = ({ profile: { currentGameId }}) => {
  if (currentGameId) {
    return [
      { 
        path: `/games/${currentGameId}/patches`, 
        storeAs: 'patches'
      },
      {
        path: `/games/${currentGameId}/currentPowerIndex`,
        storeAs: 'currentPowerIndex'
      },
      {
        path: `/games/${currentGameId}/boardStrings`,
        storeAs: 'boardStrings'
      }
    ]
  } else {
    return []
  }
}

const BoardContainer = compose(
  firebaseConnect(topLevel),
  connect(mapStateToProps)
)(Board)

export default BoardContainer

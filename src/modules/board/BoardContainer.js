// @flow
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firebaseConnect } from 'react-redux-firebase'
import Board from './components/Board'
import { 
  overlayPhase,
  advanceButtonPhase,
} from './selectors'
import { isCurrentPower } from '../../selectors/getCurrentPower'

const mapStateToProps = (state) => {
  return {
    territories: state.territories,
    phase: state.phase,
    router: state.router,
    hasOverlay: overlayPhase(state),
    advanceBtn: advanceButtonPhase(state),
    isCurrentPower: isCurrentPower(state)
  }
}

const loginStatus = ({ profile: { currentGameId } }) => {
  if (currentGameId) {
    return [
      {
        path: `/games/${currentGameId}/currentPowerIndex`,
        storeAs: 'currentPowerIndex'
      }
    ]
  } else {
    return []
  }
}

const boardStatus = ({ isCurrentPower, profile: { currentGameId }}) => {
  if (currentGameId && !isCurrentPower) {
    return [
      { 
        path: `/games/${currentGameId}/patches`, 
        storeAs: 'patches',
        queryParams: ['orderByKey']
      },
      {
        path: `/games/${currentGameId}/boardStrings`,
        storeAs: 'boardStrings',
        queryParams: ['orderByKey']
      }
    ]
  } else {
    return []
  }
}

const BoardContainer = compose(
  connect(mapStateToProps),
  firebaseConnect(loginStatus),
  firebaseConnect(boardStatus)
)(Board)

export default BoardContainer

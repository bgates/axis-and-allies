import { compose } from 'redux'
import { connect } from 'react-redux'
import { firebaseConnect } from 'react-redux-firebase'
import { getLoggedInPower } from '../../../selectors/getCurrentPower'
import Chat from './Chat'

const chats = ({ profile: { currentGameId, axis }}) => {
  return [
    { 
      path: `/chat/${currentGameId}`, 
      storeAs: 'chat'
    }, 
    { 
      path: `/${axis ? 'axis' : 'allies'}Chat/${currentGameId}`,
      storeAs: 'sideChat' 
    }
  ]
}

const mapStateToProps = (state) => ({ 
  loggedInPower: getLoggedInPower(state),
  firebase: state.firebase
})

export default compose(
  firebaseConnect(chats),
  connect(mapStateToProps)
)(Chat)

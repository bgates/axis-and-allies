import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { firebaseConnect } from 'react-redux-firebase'
import { persistor } from '../../../config/configureStore'
import { RESET } from '../../../actions'
import Login from './Login'
                         
const login = (email, password) => {
  return (dispatch, _, getFirebase) => {
    const firebase = getFirebase()
    return firebase.login({ email, password })
  }
}

const logout = () => {
  return (dispatch, _, getFirebase) => {
    const firebase = getFirebase()
    firebase.logout()
  }
}

const reset = () => {
  return dispatch => {
    persistor.purge()
    dispatch({ type: RESET })
    dispatch(push('/'))
  }
}

const emailToKey = emailAddress => btoa(emailAddress)

const moveInviteDataToUser = (firebase, email, uid) => {
  const key = emailToKey(email)       
  firebase.update(`/emails`, { [key]:  uid })
  const invite = firebase.ref(`/invites/${key}`)
  return invite.once('value').then(snapshot => {
    if (snapshot.val()) {
      const oldRef = firebase.ref(`/users/${key}`)
      oldRef.once('value').then(snapshot => {
        firebase.ref(`/users/${uid}`).update(snapshot.val())
      })
      .then(() => {
        oldRef.set(null)
        invite.set(null)
      })
    }
  })
}

const signup = (email, password) => {
  return (dispatch, getState, getFirebase) => {
    const fb = getFirebase()
    return fb.createUser({ email, password })
      .then(user => {
        const { email } = user
        const state = getState()
        const { firebase } = state
        moveInviteDataToUser(fb, email, firebase.auth.uid).then(() => {
          if (!firebase.profile.currentGameId) {
            dispatch(push('/create-game'))  
          }
        })
      })
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return bindActionCreators({ 
    login,
    signup,
    logout,
    reset
  }, dispatch)
}

const LoginContainer = compose(
  firebaseConnect(),
  connect(
    ({ firebase: { authError, auth } }) => ({ 
      authError, auth
    }),
    mapDispatchToProps
  )
)(Login)

export default LoginContainer


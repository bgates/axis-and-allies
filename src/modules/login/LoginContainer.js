import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { firebaseConnect } from 'react-redux-firebase'
import { setLoggedInPower, logoutUser } from '../../actions'
import { getLoggedInPower } from './selectors'
import Login from './Login'
                         
const login = (email, password) => {
  return (dispatch, _, getFirebase) => {
    const firebase = getFirebase()
    return firebase.login({ email, password })
      .then(response => getLoggedInPower(firebase, response.user))
      .then(power => dispatch(setLoggedInPower(power)))
  }
}

const logout = () => {
  return (dispatch, _, getFirebase) => {
    const firebase = getFirebase()
    firebase.logout().then(() => dispatch(logoutUser()))
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return bindActionCreators({ 
    login,
    logout
  }, dispatch)
}

const mapStateToProps = (state) => {
  return {
    authError: state.firebase.authError,
    auth: state.firebase.auth
  }
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


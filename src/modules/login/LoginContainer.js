import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { firebaseConnect } from 'react-redux-firebase'
import { setUserId } from '../../actions'
import Login from './Login'

const login = (email, password) => {
  return (dispatch, _, getFirebase) => {
    const firebase = getFirebase()
    return firebase.login({ email, password })
      .then(response => dispatch(setUserId(response.user.uid)))
      .then(console.log)
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return bindActionCreators({ 
    login
  }, dispatch)
}

const LoginContainer = compose(
  firebaseConnect(),
  connect(
    ({ firebase: { authError } }) => ({ 
      authError 
    }),
    mapDispatchToProps
  )
)(Login)

export default LoginContainer


import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase'
import LoginModal from './LoginModal'

const login = (email, password, firebase) => {
  return (dispatch) => {
    firebase.login({ email, password }).then(() => dispatch(push('/')))
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return bindActionCreators({ 
    login: (email, password) => login(email, password, ownProps.firebase)
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
)(LoginModal)

export default LoginContainer


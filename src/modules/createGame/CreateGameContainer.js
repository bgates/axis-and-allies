import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase'
import CreateGame from './CreateGame'
import initialPowers from '../../config/initialPowers'

const createGame = (formData, firebase) => {
  return (dispatch) => {
    let game = { powers: [ ...initialPowers] }
    for (const pair of formData.entries()) {
      const [attr, name] = pair[0].split('_')
      console.log(name)
      let power = game.powers.find(p => p.name.toLowerCase() === name)
      power[attr] = pair[1]
    }
    game.currentPlayer = game.powers[0].email
    firebase.push('/games', game).then(snapshot => console.log(snapshot.key))
    //firebase.login({ email, password }).then(() => dispatch(push('/')))
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return bindActionCreators({ 
    createGame: (formData) => createGame(formData, ownProps.firebase)
  }, dispatch)
}

const CreateGameContainer = compose(
  firebaseConnect(),
  connect(
    ({ firebase: { authError } }) => ({ 
      authError 
    }),
    mapDispatchToProps
  )
)(CreateGame)

export default CreateGameContainer


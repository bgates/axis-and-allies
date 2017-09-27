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
      let power = game.powers.find(p => p.name.toLowerCase() === name)
      power[attr] = pair[1]
    }
    game.currentPlayer = game.powers[0].email
    firebase.push('/games', game)
      .then(snapshot => connectEachPlayerToGame(firebase, game, snapshot.key))
    //firebase.login({ email, password }).then(() => dispatch(push('/')))
  }
}

const emailToKey = emailAddress => btoa(emailAddress)
const keyToEmail = key => atob(key)

const connectEachPlayerToGame = (firebase, game, gameId) => {
  firebase.ref('/emails').once('value').then(snapshot => {
    const emails = snapshot.val()
    console.log('emails', emails)
    game.powers.forEach(power => {
      const emailKey = emailToKey(power.email)
      let uid = emails[emailKey]
      if (!uid) {
        uid = emailKey
        firebase.update('/invites', { [emailKey]: true })
      }
      firebase.update(`/users/${uid}/${gameId}`, { [power.name]: power.screenname })
    })
  })
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


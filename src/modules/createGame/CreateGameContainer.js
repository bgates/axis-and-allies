import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase'
import CreateGame from './CreateGame'
import initialPowers from '../../config/initialPowers'

const setupGame = (formData) => {
  let game = { powers: [ ...initialPowers] }
  for (const pair of formData.entries()) {
    const [attr, name] = pair[0].split('_')
    let power = game.powers.find(p => p.name.toLowerCase() === name)
    power[attr] = pair[1]
  }
  game.currentPlayer = game.powers[0].email
  return game
}

const createGame = (formData, firebase) => {
  return (dispatch) => {
    const game = setupGame(formData)
    firebase.push('/games', game)
      .then(snapshot => {
        connectEachPlayerToGame(firebase, game.powers, snapshot.key)
      })
      .then(() => dispatch(push('/')))
  }
}

const emailToKey = emailAddress => btoa(emailAddress)
const keyToEmail = key => atob(key)

const invitesBasedOn = (emails, emailKeys) => (  
  emailKeys.filter(emailKey => !emails[emailKey]).map(emailKey => `/invites/${emailKey}`)
)

const updateForPower = (emails, emailKeys) => (
  emailKeys.map(emailKey => `/users/${emails[emailKey] || emailKey}`)
)

const setCurrentGame = (emails, emailKeys, gameId, firebase) => {
  emailKeys.forEach(emailKey => {
    firebase.ref(`/users/${emails[emailKey] || emailKey}`)
      .child('currentGame')
      .transaction(currentGameId => currentGameId || gameId)
  })
}

const connectEachPlayerToGame = (firebase, powers, gameId) => {
  firebase.ref('/emails').once('value').then(snapshot => {
    const emails = snapshot.val()
    const emailKeys = powers.map(power => emailToKey(power.email))
    const invites = invitesBasedOn(emails, emailKeys)
    const userUpdates = updateForPower(emails, emailKeys)
    let updates = {}
    invites.forEach(invite => updates[invite] = true)
    powers.forEach((power, index) => {  
      updates[`${userUpdates[index]}/${gameId}/${power.name}`] = power.screenName
    })
    firebase.ref('/').update(JSON.parse(JSON.stringify(updates)))
      .then(() => setCurrentGame(emails, emailKeys, gameId, firebase))
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


import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { firebaseConnect } from 'react-redux-firebase'
import CreateGame from './CreateGame'
import { getLoggedInPower } from '../login'
import { setGameId, setLoggedInPower } from '../../actions'
import initialPowers from '../../config/initialPowers'

const setupGame = (formData) => {
  let game = { powers: initialPowers, currentPowerIndex: 0 }
  for (const pair of formData.entries()) {
    const [attr, name] = pair[0].split('_')
    let power = game.powers.find(p => p.name.toLowerCase() === name)
    power[attr] = pair[1]
  }
  return game
}

const setLoggedInPowerIfPossible = (firebase, dispatch) => {
  if (firebase.auth().currentUser) {
    getLoggedInPower(firebase, firebase.auth().currentUser)
      .then(power => dispatch(setLoggedInPower(power)))
  }
}
const createGame = (formData) => {
  return (dispatch, _, getFirebase) => {
    const game = setupGame(formData)
    const firebase = getFirebase()
    firebase.push('/games', game)
      .then(snapshot => {
        dispatch(setGameId(snapshot.key))
        connectEachPlayerToGame(firebase, game.powers, snapshot.key)
          .then(() => setLoggedInPowerIfPossible(firebase, dispatch))
      })
      .then(() => dispatch(push('/')))
  }
}

const emailToKey = emailAddress => btoa(emailAddress)
//const keyToEmail = key => atob(key)

const invitesBasedOn = (emails, emailKeys) => (  
  emailKeys.filter(emailKey => !emails[emailKey]).map(emailKey => `/invites/${emailKey}`)
)

const updateForPower = (emails, emailKeys) => (
  emailKeys.map(emailKey => `/users/${emails[emailKey] || emailKey}`)
)

const setCurrentGame = (emails, emailKeys, gameId, firebase) => {
  emailKeys.forEach((emailKey, index)=> {
    firebase.ref(`/users/${emails[emailKey] || emailKey}`)
      .transaction(user => {
        if (!user || !user.currentGameId) {
          return { 
            ...user, 
            currentGameId: gameId, 
            axis: index % 2 === 0 && index < 5 
          }
        }
      })
  })
}

const connectEachPlayerToGame = (firebase, powers, gameId) => {
  return firebase.ref('/emails').once('value').then(snapshot => {
    const emails = snapshot.val()
    const emailKeys = powers.map(power => emailToKey(power.email))
    const invites = invitesBasedOn(emails, emailKeys)
    const userUpdates = updateForPower(emails, emailKeys)
    let updates = {}
    invites.forEach(invite => updates[invite] = true)
    powers.forEach((power, index) => {  
      updates[`${userUpdates[index]}/${gameId}/${power.name}`] = power.screenname
    })
    return firebase.ref().update(updates)
      .then(() => setCurrentGame(emails, emailKeys, gameId, firebase))
  })
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ 
    createGame
  }, dispatch)
}

const CreateGameContainer = compose(
  firebaseConnect(),
  connect(
    ({ firebase: { authError, auth, profile } }) => ({ 
      authError, auth, profile
    }),
    mapDispatchToProps
  )
)(CreateGame)

export default CreateGameContainer


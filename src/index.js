import reactDOM from 'react-dom'
import React from 'react'
import { Provider } from 'react-redux'
import { ConnectedRouter as Router } from 'connected-react-router'
import { getFirebase } from 'react-redux-firebase'
import DiffMatchPatch from 'diff-match-patch'
import configureStore, { history } from './config/configureStore'
import App from './App'
import { setLoggedInPower } from './actions'
import './assets/styles/index.css'

const store = configureStore()
 
function observeBoardChanges (store) {
  const dmp = new DiffMatchPatch();
  let currentBoardString = '';

  function handleChange() {
    let nextBoardString = store.getState().boardString;
    if (nextBoardString !== currentBoardString) {
      let diffs = dmp.diff_main(currentBoardString, nextBoardString)
      dmp.diff_cleanupEfficiency(diffs)
      const patches = dmp.patch_make(currentBoardString, diffs)
      console.log({ diffs, patches })
      currentBoardString = nextBoardString;
    }
  }

  store.subscribe(handleChange);
  handleChange();
}

function observeProfileChanges (store) {
  let currentProfile = {}

  function handleChange () {
    const nextFirebase = store.getState().firebase
    let nextProfile = nextFirebase.profile
    if (nextProfile.currentGameId !== currentProfile.currentGameId) {
      currentProfile = nextProfile
      const firebase = getFirebase()
      const { currentGameId } = nextProfile
      firebase.ref(`/games/${currentGameId}`).once('value').then(snapshot => {
        const email = nextFirebase.auth.email
        const { powers, currentPowerIndex } = snapshot.val()
        const powersInOrder = [...powers.slice(currentPowerIndex), ...powers.slice(0, currentPowerIndex)]
        return powersInOrder.find(power => power.email === email)
      }).then(power => {
        store.dispatch(setLoggedInPower(power))
      })
    }
  }
  store.subscribe(handleChange)
  handleChange()
}

observeBoardChanges(store)
observeProfileChanges(store)

reactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>, document.getElementById('root')
)

if (module.hot) {
  module.hot.accept('./reducers', () => {
    const nextRootReducer = require('./reducers/index');
    store.replaceReducer(nextRootReducer);
  });
}

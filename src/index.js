import reactDOM from 'react-dom'
import React from 'react'
import { Provider } from 'react-redux'
import { ConnectedRouter as Router } from 'connected-react-router'
import DiffMatchPatch from 'diff-match-patch'
import configureStore, { history } from './config/configureStore'
import App from './App'
import './assets/styles/index.css'

const store = configureStore()
 
const dmp = new DiffMatchPatch();

let currentBoardString = ''
function handleChange() {
  let previousBoardString = currentBoardString
  currentBoardString = store.getState().boardString
  if (previousBoardString !== currentBoardString) {
  let diffs = dmp.diff_main(previousBoardString, currentBoardString)
  dmp.diff_cleanupEfficiency(diffs)
  const patches = dmp.patch_make(previousBoardString, diffs)
    console.log({ diffs, patches })
  }
}

const unsubscribe = store.subscribe(handleChange)

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

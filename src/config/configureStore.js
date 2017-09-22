import { createStore, compose, applyMiddleware } from 'redux'
import * as firebase from 'firebase'
import { reactReduxFirebase } from 'react-redux-firebase'
import { createBrowserHistory } from 'history'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import thunk from 'redux-thunk'
import reducer from '../reducers'
import firebaseConfig from './firebase'

firebase.initializeApp(firebaseConfig)
const rrfConfig = {
  userProfile: 'users'
}

export const history = createBrowserHistory()

const reducerWithRouteState = connectRouter(history)(reducer)

const configureStore = (initialState) => {
  const createStoreWithMiddleware = compose(
    applyMiddleware(routerMiddleware(history), thunk),
    reactReduxFirebase(firebase, rrfConfig),
    typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : f => f
  )(createStore)
  const store = createStoreWithMiddleware(reducerWithRouteState, initialState)
  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers/index').default
      const nextRootReducerWithRouteState = connectRouter(history)(nextRootReducer)
      store.replaceReducer(nextRootReducerWithRouteState)
    })
  }
  return store
}
export default configureStore


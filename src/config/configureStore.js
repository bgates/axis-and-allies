import { createStore, compose, applyMiddleware } from 'redux'
import { persistStore, autoRehydrate } from 'redux-persist'
import * as firebase from 'firebase'
import { reactReduxFirebase, getFirebase } from 'react-redux-firebase'
import { createBrowserHistory } from 'history'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import thunk from 'redux-thunk'
import reducer from '../reducers'
import firebaseConfig from './firebase'
import { newParse } from '../lib/Parser'
import { nextId } from '../selectors/units'
import Board from './startingBoard'
import territoryData from './territories'

firebase.initializeApp(firebaseConfig)
const rrfConfig = {
  userProfile: 'users'
}

let devTools = (f) => f
if (window && window.devToolsExtension) {
  devTools = window.devToolsExtension()
} 

const basename = process.env.NODE_ENV === 'production' ? '/axis-and-allies' : ''
export const history = createBrowserHistory({ basename })

const reducerWithRouteState = connectRouter(history)(reducer)

const stateReconciler = (state, inboundState, reducedState, log) => {
  let newState = {...reducedState}
  Object.keys(inboundState).forEach(key => {
    if (Array.isArray(state[key]) || typeof state[key] !== 'object') {
      newState[key] = inboundState[key]
    } else {
      newState[key] = {...state[key], ...inboundState[key]} // shallow merge
    }
  })
  return newState
}

let initialUnits = {}
let initialTerritories = []
newParse(Board).forEach((territoryUnits, index) => {
  initialTerritories[index] = { unitIds: [], currentPower: territoryData[index].original_power }
  territoryUnits.forEach(unit => {
    const id = nextId()
    initialUnits[id] = { ...unit, id }
    initialTerritories[index].unitIds.push(id)
  })
})

export const initialState = { units: initialUnits, territories: initialTerritories }

const store = createStore(
  reducerWithRouteState,
  initialState,
  compose(
    applyMiddleware(
      routerMiddleware(history),
      thunk.withExtraArgument(getFirebase)
    ),
    reactReduxFirebase(firebase, rrfConfig),
    autoRehydrate({ log: true, stateReconciler }),
    devTools
  )
)
export const persistor = persistStore(store)

export default store


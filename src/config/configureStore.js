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
import { id } from '../lib/unit'
import Board from './startingBoard'
import territoryData from './territories.json'

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
   newState[key] = {...state[key], ...inboundState[key]} // shallow merge
  })
  return newState
}

let initialUnits = {}
let initialTerritories = []
newParse(Board).forEach((territoryUnits, index) => {
  initialTerritories[index] = { units: [], currentPower: territoryData[index].original_power }
  territoryUnits.forEach(unit => {
    const _id = id()
    initialUnits[_id] = unit
    initialTerritories[index].units.push(_id)
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


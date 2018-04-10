// @flow
import { combineReducers } from 'redux'
import { amphib } from '../modules/transport'
// import { updateBoard } from '../modules/board'
import { bombardment } from '../modules/bombardment'
import { casualties } from '../modules/selectCasualties'
import combatUnderway from './combatUnderway'
import conquered from './conquered'
import currentPowerIndex from './currentPower'
import dogfight from './dogfight'
import { flak } from '../modules/flak'
import flightDistance from './flightDistance'
import inboundUnits from './inboundUnits'
import { income } from '../modules/income'
import { landPlanes } from '../modules/landPlanes'
import missionComplete from './mission'
import outboundUnits from './outboundUnits'
import phase from './phase'
import { placement } from '../modules/placement'
import powers from './powers'
import { purchases } from '../modules/purchases'
import { research } from '../modules/research'
import { rocketTargets } from '../modules/rockets'
import { strategicBombing } from '../modules/strategicBomb'
import territories from './territories'
import { transport } from '../modules/loadTransport'
import units from './units'
import unitDestination from './unitDestination'
import unitOrigin from './unitOrigin'
import rolls from './rolls'
import { boardString, updateBoardString } from './updateBoardString'
import { 
  DOGFIGHT,
  VIEW_STRATEGIC_BOMBING_RESULTS,
  RETREAT,
  RESET
} from '../actions'
import { actionTypes, firebaseStateReducer as firebase } from 'react-redux-firebase'
import { initialState } from '../config/configureStore'
import type { Action } from '../actions/types'

const combinedReducer = combineReducers({
  amphib,
  bombardment,
  casualties,
  combatUnderway,
  conquered,
  currentPowerIndex,
  dogfight,
  boardString,
  firebase,
  flak,
  flightDistance,
  inboundUnits,
  income,
  landPlanes,
  missionComplete,
  outboundUnits,
  phase,
  placement,
  powers,
  purchases,
  research,
  rolls,
  rocketTargets,
  territories,
  transport,
  strategicBombing,
  units,
  unitOrigin,
  unitDestination
})

const crossSliceReducer = (state, action) => {
  switch(action.type) {
      //case COMMIT_UNITS:
      //case UNCOMMIT_UNITS:
      //case LOAD_TRANSPORT:
      //case COMMIT_AMPHIB_UNITS:
      //case UNCOMMIT_AMPHIB_UNITS:
      //case RESOLVE_COMBAT:
      //case REMOVE_CASUALTIES:
      //case WIN_ATTACK:
      //case LOSE_ATTACK:
      //case PLACE_UNITS: 
      //case LAND_PLANES:
      //case PLAN_MOVEMENT:
    case DOGFIGHT:
    case VIEW_STRATEGIC_BOMBING_RESULTS:
    case RETREAT:
      {
        return {
          ...state,
          boardString: updateBoardString(state.territories)
        }        
    }
    case actionTypes.SET: {
      return {
        ...state,
        //board: updateBoard(action, state)
      }
    }
    default : 
      return state
  }
}

const rootReducer = (state = initialState, action: Action) => {
  let intermediateState
  if (action.type === RESET) {
    intermediateState = combinedReducer(initialState, action)
  } else {
    intermediateState = combinedReducer(state, action)
  }
  return crossSliceReducer(intermediateState, action)
}
export default rootReducer

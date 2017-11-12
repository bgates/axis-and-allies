import { combineReducers } from 'redux'
import { amphib } from '../modules/transport'
import { board, updateBoard } from '../modules/board'
import { casualties } from '../modules/selectCasualties'
import currentPowerIndex from './currentPower'
import inboundUnits from './inboundUnits'
import { landPlanes } from '../modules/landPlanes'
import outboundUnits from './outboundUnits'
import phase from './phase'
import { placement } from '../modules/placement'
import powers from './powers'
import { purchases } from '../modules/purchases'
import { research } from '../modules/research'
import strategicBombing from './strategicBombing'
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
  LOSE_ATTACK,
  LAND_PLANES,
  PLAN_MOVEMENT,
  PLACE_UNITS,
  RESET
} from '../actions'
import { actionTypes, firebaseStateReducer as firebase } from 'react-redux-firebase'
import { initialState } from '../config/configureStore'

const combinedReducer = combineReducers({
  amphib,
  casualties,
  currentPowerIndex,
  board,
  boardString,
  firebase,
  inboundUnits,
  landPlanes,
  outboundUnits,
  phase,
  placement,
  powers,
  purchases,
  research,
  rolls,
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
    case DOGFIGHT:
    case VIEW_STRATEGIC_BOMBING_RESULTS:
    case RETREAT:
    case LOSE_ATTACK:
    case LAND_PLANES:
    case PLAN_MOVEMENT:
    case PLACE_UNITS: {
        return {
          ...state,
          boardString: updateBoardString(state.board.territories)
        }        
    }
    case actionTypes.SET: {
      return {
        ...state,
        board: updateBoard(action, state)
      }
    }
    default : 
      return state;
  }
}

const rootReducer = (state = initialState, action) => {
  if (action.type === RESET) {
    state = initialState
  }
  const intermediateState = combinedReducer(state, action);
  return crossSliceReducer(intermediateState, action);
}
export default rootReducer;

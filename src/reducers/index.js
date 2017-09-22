import { combineReducers } from 'redux'
import { board } from '../modules/board'
import phase from './phase'
import { purchases } from '../modules/purchases'
import { research } from '../modules/research'
import { landPlanes } from '../modules/landPlanes'
import { placement } from '../modules/placement'
import rolls from './rolls'
import { updateBoardString } from './updateBoardString'
import { 
  DOGFIGHT,
  VIEW_STRATEGIC_BOMBING_RESULTS,
  RESOLVE_COMBAT,
  REMOVE_CASUALTIES,
  COMMIT_UNITS,
  UNCOMMIT_UNITS,
  COMMIT_AMPHIB_UNITS,
  UNCOMMIT_AMPHIB_UNITS,
  LOAD_TRANSPORT,
  WIN_ATTACK,
  LOSE_ATTACK,
  LAND_PLANES,
  PLAN_MOVEMENT,
  PLACE_UNITS
} from '../actions';
import { firebaseStateReducer as firebase } from 'react-redux-firebase'
       
const combinedReducer = combineReducers({
  firebase,
  board,
  boardString: (state = '', action) => state,
  landPlanes,
  phase,
  placement,
  purchases,
  research,
  rolls
})

const crossSliceReducer = (state, action) => {
  switch(action.type) {
    case DOGFIGHT:
    case VIEW_STRATEGIC_BOMBING_RESULTS:
    case RESOLVE_COMBAT:
    case REMOVE_CASUALTIES:
    case COMMIT_UNITS:
    case UNCOMMIT_UNITS:
    case COMMIT_AMPHIB_UNITS:
    case UNCOMMIT_AMPHIB_UNITS:
    case LOAD_TRANSPORT:
    case WIN_ATTACK:
    case LOSE_ATTACK:
    case LAND_PLANES:
    case PLAN_MOVEMENT:
    case PLACE_UNITS: {
        return {
          ...state,
          boardString: updateBoardString(state.boardString, state.board.territories)
        }        
    }
    default : 
      return state;
  }
}

const rootReducer = (state = {}, action) => {
  const intermediateState = combinedReducer(state, action);
  return crossSliceReducer(intermediateState, action);
}
export default rootReducer;

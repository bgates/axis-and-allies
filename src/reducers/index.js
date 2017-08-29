import { combineReducers } from 'redux'
import { board } from '../modules/board'
import phase from './phase'
import { purchases } from '../modules/purchases'
import { research } from '../modules/research'
import { landPlanes } from '../modules/landPlanes'
import rolls from './rolls'
import { placement } from '../modules/placement'
import { firebaseStateReducer as firebase } from 'redux-react-firebase'
       
export default combineReducers({
  firebase,
  board,
  landPlanes,
  phase,
  placement,
  purchases,
  research,
  rolls
})


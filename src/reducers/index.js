import { combineReducers } from 'redux'
import { board } from '../modules/board'
import { powers } from '../modules/powers'
import phase from './phase'
import { purchases } from '../modules/purchases'
import { research } from '../modules/research'
import rolls from './rolls'
import { firebaseStateReducer as firebase } from 'redux-react-firebase'
       
export default combineReducers({
  firebase,
  board,
  powers,
  phase,
  purchases,
  research,
  rolls
})


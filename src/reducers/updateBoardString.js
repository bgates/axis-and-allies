import { actionTypes } from 'react-redux-firebase'
import { dehydrate } from '../lib/Parser'
import Board from '../config/startingBoard'

export const updateBoardString = (currentBoard) => {
  return dehydrate(currentBoard)
}

export const boardString = (state = Board, action) => {
  if (action.type === actionTypes.SET && action.path === 'boardStrings') {
    const boardStrings = action.ordered
    return boardStrings[boardStrings.length - 1].value
  } else {
    return state
  }
}


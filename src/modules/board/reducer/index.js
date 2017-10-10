import { actionTypes } from 'react-redux-firebase'
import territoriesHelper from './territoriesHelper'
import powersHelper from './powersHelper'
import incomeHelper from './incomeHelper'
import Parser from '../../../lib/Parser'
import startingBoard from '../../../config/startingBoard'
import territoryData from '../../../config/territories.json'
import initialPowers from '../../../config/initialPowers';
import { NEXT_TURN } from '../../../actions'

const boardFromString = boardString => {
  const parsedBoard = Parser.hydrate(boardString)
  return territoryData.map((territory, i) => (
    {
      units: parsedBoard[i],
      unitsFrom: [],
      currentPower: territory.original_power //TODO: how to update currentPower?
    }
  ))
}

const initialState = { 
  territories: boardFromString(startingBoard), 
  powers: initialPowers,
  currentPowerIncome: 0,
  currentPowerIndex: 0
}

const indexHelper = (state, action) => {
  if (action.type === NEXT_TURN) {
    return (state.currentPowerIndex + 1) % 7
  } else if (action.type === actionTypes.SET && action.path === 'currentPowerIndex') {
    return action.data
  } else {
    return state.currentPowerIndex
  }
}

export const board = (state = initialState, action) => {
  return { 
    territories: territoriesHelper(state, action),
    powers: powersHelper(state, action),
    currentPowerIncome: incomeHelper(state, action),
    currentPowerIndex: indexHelper(state, action)
  }
}

export const updateBoard = (action, state) => {
  if (action.path === 'boardStrings') {
    return { ...state.board, territories: boardFromString(state.boardString) }
  } else {
    return state.board
  }
}

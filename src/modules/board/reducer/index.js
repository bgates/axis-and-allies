import territoriesHelper from './territoriesHelper'
import powersHelper from './powersHelper'
import incomeHelper from './incomeHelper'
import Parser from '../../../lib/Parser'
import startingBoard from '../../../config/startingBoard'
import territoryData from '../../../config/territories.json'
import initialPowers from '../../../config/initialPowers';
import { NEXT_TURN } from '../../../actions'
import { actionTypes } from 'react-redux-firebase'

const parsedBoard = Parser.hydrate(startingBoard)

const initialBoard = territoryData.map((territory, i) => {
  return {
    units: parsedBoard[i],
    unitsFrom: [],
    currentPower: territory.original_power
  }
  //TODO: currentPower should be controllingPower
})

const initialState = { 
  territories: initialBoard, 
  powers: initialPowers,
  currentPowerIncome: 0,
  currentPowerIndex: 0,
  spectator: startingBoard
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

const board = (state = initialState, action) => {
  return { 
    territories: territoriesHelper(state, action),
    powers: powersHelper(state, action),
    currentPowerIncome: incomeHelper(state, action),
    currentPowerIndex: indexHelper(state, action)
  }
}

export default board

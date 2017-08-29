import territoriesHelper from './territoriesHelper'
import powersHelper from './powersHelper'
import incomeHelper from './incomeHelper'
import Parser from '../../../lib/Parser.js'
import startingBoard from '../../../config/startingBoard'
import territoryData from '../../../config/territories.json'
import initialPowers from '../../../config/initialPowers';

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
  currentPowerIncome: 0 
}

const board = (state = initialState, action) => {
  return { 
    territories: territoriesHelper(state, action),
    powers: powersHelper(state, action),
    currentPowerIncome: incomeHelper(state, action),
  }
}

export default board

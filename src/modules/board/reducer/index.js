import Parser from '../../../lib/Parser'
import territoryData from '../../../config/territories.json'

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

export const updateBoard = (action, state) => {
  if (action.path === 'boardStrings') {
    return { ...state.board, territories: boardFromString(state.boardString) }
  } else {
    return state.board
  }
}

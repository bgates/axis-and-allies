// @flow
import Parser from '../../../lib/Parser'
import territoryData from '../../../config/territories'

const boardFromString = boardString => {
  const parsedBoard = Parser.hydrate(boardString)
  return territoryData.map((territory, i) => (
    {
      units: parsedBoard[i],
      unitsFrom: [],
      currentPower: territory.original_power 
    }
  ))
}

export const updateBoard = (action: { path: string }, state:{ board:any, boardString:string, territories:Array<Object> }) => {
  if (action.path === 'boardStrings') {
    return { ...state.board, territories: boardFromString(state.boardString) }
  } else {
    return state.board
  }
}

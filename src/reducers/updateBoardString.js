import { dehydrate } from '../lib/Parser'

export const updateBoardString = (boardDiff, currentBoard) => {
  return dehydrate(currentBoard)
}


import DiffMatchPatch from 'diff-match-patch'
import { dehydrate } from '../lib/Parser'

const dmp = new DiffMatchPatch();

export const setPriorBoardDiff = (boardDiff = {}, action) => {
  const priorBoardString = boardDiff.currentBoardString || ''
  return { ...boardDiff, priorBoardString }
}

export const updateBoardDiff = (boardDiff, currentBoard) => {
  const currentBoardString = dehydrate(currentBoard)
  let diffs = dmp.diff_main(boardDiff.priorBoardString, currentBoardString)
  dmp.diff_cleanupEfficiency(diffs)
  return { 
    priorBoardString: boardDiff.currentBoardString,  
    currentBoardString,
    diffs
  }
}


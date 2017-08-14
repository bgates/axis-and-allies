import Parser from '../../lib/Parser.js'
import startingBoard from '../../config/startingBoard'
import territoryData from '../../config/territories.json'
import {
  commitUnits,
  uncommitUnits,
  loadTransport
} from './moveUnitReducerFunctions';
import {
  removeCasualties,
  toggleCasualties,
  defenderWins,
  attackerWins
} from './casualtyReducerFunctions';

const parsedBoard = Parser.hydrate(startingBoard)

const initialBoard = territoryData.map((territory, i) => {
  return {
    units: parsedBoard[i],
    unitsFrom: [],
    currentPower: territory.original_power
  }
  //TODO: currentPower should be controllingPower
})

const board = (state = initialBoard, action) => {
  switch (action.type) {
    case 'COMMIT_UNITS': return commitUnits(state, action);
    case 'UNCOMMIT_UNITS': return uncommitUnits(state, action);
    case 'LOAD_TRANSPORT': return loadTransport(state, action);
    case 'REMOVE_CASUALTIES': return removeCasualties(state, action);
    case 'TOGGLE_CASUALTY': return toggleCasualties(state, action);
    case 'DEFENDER_WINS': return defenderWins(state, action);
    case 'ATTACKER_WINS': return attackerWins(state, action);
    default:
      return state
  }
}
export default board

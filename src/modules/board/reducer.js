import Parser from '../../lib/Parser.js'
import startingBoard from '../../config/startingBoard'
import territoryData from '../../config/territories.json'
import {
  commitUnits,
  uncommitUnits,
  loadTransport
} from './moveUnitReducerFunctions';

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
    case 'TOGGLE_CASUALTY': {
      const { id, territoryIndex } = action;
      return state.map((territory, index) => {
        if (index === territoryIndex) {
          territory.attackerCasualties = territory.attackerCasualties || [];
          if (territory.attackerCasualties.includes(id)) {
            territory.attackerCasualties = territory.attackerCasualties.filter(otherId => otherId !== id)
          } else {
            territory.attackerCasualties = [...territory.attackerCasualties, id];
          }
        }
        return territory;
      });
    }
    default:
      return state
  }
}
export default board

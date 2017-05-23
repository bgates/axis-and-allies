import React from 'react';
import { PowersContainer } from '../powers';
import Territories from './Territories';

const Board = ({ board, phase, hasOverlay, advanceBtn, currentPower, territoryClick }) => {
  return (
    <div>
      <PowersContainer />
      <Territories 
        board={board}
        territoryClick={territoryClick}
        currentPower={currentPower}
        hasOverlay={hasOverlay}
        advanceBtn={advanceBtn}
        phase={phase} />
    </div>
  )
}
export default Board

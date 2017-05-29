import React from 'react';
import { PowersContainer } from '../powers';
import { Route, Redirect } from 'react-router-dom'
import Territories from './Territories';

const paths = ['start', 'repair', 'research', 'research/results', 'rockets', 'rockets/results', 'purchase', 'income', 'lend-lease', 'plan-combat', 'resolve-combat']

const BoardWithRedirect = (props) => {
  return (
    <Route path='/' render={routeProps => (
      paths.indexOf(props.phase.minimum) < paths.indexOf(props.phase.current) ? <Board {...props} {...routeProps} /> : <Redirect to={props.phase.minimum} />

    )} />
  )
}

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
export default BoardWithRedirect

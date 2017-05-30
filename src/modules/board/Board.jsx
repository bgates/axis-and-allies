import React from 'react';
import { PowersContainer } from '../powers';
import { Route, Redirect } from 'react-router-dom'
import Territories from './Territories';

const paths = ['start', 'repair', 'research', 'research/results', 'rockets', 'rockets/results', 'purchase', 'income', 'lend-lease', 'plan-combat', 'resolve-combat']

const BoardWithRedirect = (props) => {
  const currentPath = props.router.location.pathname.replace('/', '') || 'start'
  const minPath = props.phase.minimum
  return (
    <div>
    <Route path='/start' render={routeProps => <Redirect to='/' />}/>
    <Route path='/' render={routeProps => (
      paths.indexOf(minPath) <= paths.indexOf(currentPath) ? console.log('render') || <Board {...props} {...routeProps} /> : console.log(minPath, currentPath) || <Redirect to={minPath} />

    )} />
    </div>
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

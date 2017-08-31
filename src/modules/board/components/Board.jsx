import React from 'react';
import { PowersContainer } from '../../powers';
import { Route, Redirect } from 'react-router-dom'
import Territories from './Territories';

const paths = ['start', 'repair', 'research', 'research/results', 'rockets', 'rockets/results', 'purchase', 'income', 'lend-lease', 'plan-combat', 'resolve-combat', 'select-casualties', 'land-planes', 'move-units', 'place-units', 'order-units', 'confirm-finish']

const BoardWithRedirect = (props) => {
  const currentPath = props.router.location.pathname.replace('/', '') || 'start'
  const minPath = props.phase.minimum.replace('/', '')
  const FirstViewableComponent = (routeProps) => {
    if (paths.indexOf(minPath) <= paths.indexOf(currentPath)) {
      return <Board {...props} {...routeProps} /> 
    } else {
      return <Redirect to={minPath} />
    } 
  }

  return (
    <div>
      <Route path='/start' render={routeProps => <Redirect to='/' />}/>
      <Route path='/' render={FirstViewableComponent} />
    </div>
  )
}

const Board = ({ board, phase, hasOverlay, advanceBtn, currentPower }) => {
  return (
    <div>
      <PowersContainer />
      <Territories 
        board={board}
        currentPower={currentPower}
        hasOverlay={hasOverlay}
        advanceBtn={advanceBtn}
        phase={phase} />
    </div>
  )
}
export default BoardWithRedirect

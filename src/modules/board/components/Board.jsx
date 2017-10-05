import React from 'react';
import { Route, Redirect } from 'react-router-dom'
import { isEmpty } from 'react-redux-firebase'
import { PowersContainer } from '../../powers';
import Territories from './Territories';
import PATHS from '../../../paths';

const paths = Object.values(PATHS);

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

const Board = ({ board, phase, hasOverlay, advanceBtn, currentPower, game }) => {
  const playing = isEmpty(game) || 
    game.loggedInPower.name === currentPower.name
  return (
    <div>
      <PowersContainer />
      <Territories 
        playing={playing}
        board={board}
        currentPower={currentPower}
        hasOverlay={hasOverlay}
        advanceBtn={advanceBtn}
        phase={phase} />
    </div>
  )
}
export default BoardWithRedirect

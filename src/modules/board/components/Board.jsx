// @flow
import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { PowersContainer } from '../../powers'
import Territories from './Territories'
import PATHS from '../../../paths'

const mayAdvance = (minimum, current = '/start') => {
  const paths = Object.values(PATHS)
  return paths.indexOf(minimum) <= paths.indexOf(current) || 
    (minimum === PATHS.COMBAT_ROLLS && [PATHS.RESOLVE_COMBAT].includes(current))
}
type Props = {
  router: { location: { pathname: string } },
  phase: { minimum: string }
}
const BoardWithRedirect = (props:Props) => {
  const { pathname } = props.router.location
  const { minimum } = props.phase
  const FirstViewableComponent = (routeProps) => {
    if (mayAdvance(minimum, pathname)) {
      return <Board {...props} {...routeProps} /> 
    } else {
      return <Redirect to={minimum} />
    } 
  }
  
  return (
    <div>
      <Route path='/start' render={routeProps => <Redirect to='/' />}/>
      <Route path='/' render={FirstViewableComponent} />
    </div>
  )
}

const Board = ({ territories, phase, hasOverlay, advanceBtn, isCurrentPower }) => {
  return (
    <div>
      <PowersContainer />
      <Territories 
        playing={isCurrentPower}
        territories={territories}
        hasOverlay={hasOverlay}
        advanceBtn={advanceBtn}
        phase={phase} />
    </div>
  )
}
export default BoardWithRedirect

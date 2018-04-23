import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import PATHS from '../../../paths'
import { FlakModal } from '../flak'
import { StrategicBombModal } from '../strategicBomb'
import { CombatContainer } from '../combat'
import { RetreatContainer } from '../retreat'
import { CombatRollsContainer } from '../combatRolls'
import { SelectCasualtiesContainer } from '../selectCasualties'

class CombatLifeCycle extends Component {

  componentDidMount () {
    this.props.onEnter(this.props.territoryIndex)
  }

  render () {
    return (
      <React.Fragment>
        <Route path={PATHS.FLAK} component={FlakModal}/>
        <Route path={PATHS.STRATEGIC_BOMB} component={StrategicBombModal}/>
        <Route path={PATHS.RESOLVE_COMBAT} component={CombatContainer}/>
        <Route path={PATHS.RETREAT} component={RetreatContainer}/>
        <Route path={PATHS.COMBAT_ROLLS} component={CombatRollsContainer}/>
        <Route path={PATHS.SELECT_CASUALTIES} component={SelectCasualtiesContainer}/>
      </React.Fragment>
    )

  }
}

export default CombatLifeCycle

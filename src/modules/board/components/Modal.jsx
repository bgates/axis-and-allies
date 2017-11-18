import React from 'react'
import classNames from 'classnames'
import { Route } from 'react-router-dom'
import RepairModal from '../../repair/RepairModal'
import { ResearchContainer } from '../../research'
import ResearchResultsContainer from '../../researchResults/ResearchResultsContainer'
import { RocketAttackContainer } from '../../rocketAttack'
import { RocketResultsContainer } from '../../rocketResults/'
import { PurchaseContainer } from '../../purchases'
import { IncomeContainer } from '../../income'
import LendLeaseModal from '../../lendLease/LendLeaseModal'
import { PlanContainer } from '../../planCombat'
import { StrategicBombModal } from '../../strategicBomb'
import { CombatContainer } from '../../combat'
import { RetreatContainer } from '../../retreat'
import { CombatRollsContainer } from '../../combatRolls'
import { SelectCasualtiesContainer } from '../../selectCasualties'
import { LandPlanesContainer } from '../../landPlanes'
import RussianWinterModal from '../../russianWinter/RussianWinterModal'
import MovementContainer from '../../movement'
import { PlacementContainer } from '../../placement'
import CarrierLoadingModal from '../../carrierLoading/CarrierLoadingModal'
import OrderUnitsModal from '../../orderUnits/OrderUnitsModal'
import PATHS from '../../../paths'

const Modal = ({ ctrlPressed, phase }) => {
  const classes = classNames('modal', phase, { hidden: ctrlPressed })
  return (
    <div id='modal' className={classes}>
      <Route path={PATHS.REPAIR} component={RepairModal}/>
      <Route path={PATHS.RESEARCH} component={ResearchContainer}/>
      <Route path={PATHS.RESEARCH_RESULTS} component={ResearchResultsContainer}/>
      <Route exact path={PATHS.ROCKETS} component={RocketAttackContainer}/>
      <Route path={PATHS.ROCKET_RESULTS} component={RocketResultsContainer}/>
      <Route path={PATHS.PURCHASE} component={PurchaseContainer}/>
      <Route path={PATHS.INCOME} component={IncomeContainer}/>
      <Route path={PATHS.LEND_LEASE} component={LendLeaseModal}/>
      <Route path={PATHS.PLAN_ATTACKS} component={PlanContainer}/>
      <Route path={PATHS.STRATEGIC_BOMB} component={StrategicBombModal}/>
      <Route path={PATHS.RESOLVE_COMBAT} component={CombatContainer}/>
      <Route path={PATHS.RETREAT} component={RetreatContainer}/>
      <Route path={PATHS.COMBAT_ROLLS} component={CombatRollsContainer}/>
      <Route path={PATHS.SELECT_CASUALTIES} component={SelectCasualtiesContainer}/>
      <Route path="/land-planes" component={LandPlanesContainer}/>
      <Route path="/russian-winter" component={RussianWinterModal}/>
      <Route path={PATHS.PLAN_MOVEMENT} component={MovementContainer}/>
      <Route path={PATHS.PLACE_UNITS} component={PlacementContainer}/>
      <Route path="/load-carrier" component={CarrierLoadingModal}/>
      <Route path={PATHS.ORDER_UNITS} component={OrderUnitsModal}/>
    </div>
  )
}

export default Modal


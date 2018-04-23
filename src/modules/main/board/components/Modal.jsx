// @flow
import React from 'react'
import classNames from 'classnames'
import { Route } from 'react-router-dom'
import { 
  RepairModal,
  IncomeContainer,
  PurchaseContainer,
  ResearchContainer,
  ResearchResultsContainer,
  RocketAttackContainer,
  RocketResultsContainer 
} from '../../../preCombat'
import LendLeaseModal from '../../../lendLease/LendLeaseModal'
import { PlanContainer } from '../../../planCombat'
import { default as CombatLifeCycle } from '../../../combat/lifecycle/LifecycleContainer'
import { 
  LandPlanesContainer,
  MovementContainer,
  PlacementContainer,
  CarrierLoadingModal,
  OrderUnitsModal,
  RussianWinterModal
} from '../../../postCombat'
import PATHS from '../../../../paths'

const COMBAT_PATHS = [
  PATHS.FLAK, 
  PATHS.STRATEGIC_BOMB, 
  PATHS.RESOLVE_COMBAT, 
  PATHS.RETREAT, 
  PATHS.COMBAT_ROLLS, 
  PATHS.SELECT_CASUALTIES
]

const Modal = ({ ctrlPressed, phase }: { ctrlPressed: boolean, phase: string }) => {
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
      <Route path={`(${COMBAT_PATHS.join('|')})`} component={CombatLifeCycle} />
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


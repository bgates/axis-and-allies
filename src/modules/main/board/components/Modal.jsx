// @flow
import React from 'react'
import classNames from 'classnames'
import { Route } from 'react-router-dom'
import RepairModal from '../../../repair/RepairModal'
import { 
  ResearchContainer,
  ResearchResultsContainer 
} from '../../../research'
import { 
  RocketAttackContainer,
  RocketResultsContainer 
} from '../../../rockets'
import { PurchaseContainer } from '../../../purchases'
import { IncomeContainer } from '../../../income'
import LendLeaseModal from '../../../lendLease/LendLeaseModal'
import { PlanContainer } from '../../../planCombat'
import { 
  FlakModal, 
  StrategicBombModal,
  CombatContainer,
  RetreatContainer,
  CombatRollsContainer,
  SelectCasualtiesContainer,
} from '../../../combat'
import { 
  LandPlanesContainer,
  MovementContainer,
  PlacementContainer,
  CarrierLoadingModal,
  OrderUnitsModal,
  RussianWinterModal
} from '../../../postCombat'
import PATHS from '../../../../paths'

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
      <Route path={PATHS.FLAK} component={FlakModal}/>
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


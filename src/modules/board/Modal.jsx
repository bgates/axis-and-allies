import React from 'react'
import classNames from 'classnames'
import { Route } from 'react-router-dom'
import RepairModal from '../repair/RepairModal'
import { ResearchContainer } from '../research'
import ResearchResultsContainer from '../researchResults/ResearchResultsContainer'
import RocketAttackContainer from '../rocketAttack/RocketAttackContainer'
import RocketResultsModal from '../rocketResults/RocketResultsModal'
import { PurchaseContainer } from '../purchases'
import { IncomeContainer } from '../income'
import LendLeaseModal from '../lendLease/LendLeaseModal'
import { PlanContainer } from '../planCombat'
import { CombatContainer } from '../combat'
import { CombatRollsContainer } from '../combatRolls'
import { SelectCasualtiesContainer } from '../selectCasualties'
import PlaneLandingModal from '../planeLanding/PlaneLandingModal'
import RussianWinterModal from '../russianWinter/RussianWinterModal'
import MovementModal from '../movement/MovementModal'
import PlacementModal from '../placement/PlacementModal'
import CarrierLoadingModal from '../carrierLoading/CarrierLoadingModal'
import EndCheckModal from '../endCheck/EndCheckModal'
import DefenseOrderModal from '../defenseOrder/DefenseOrderModal'

const Modal = ({ ctrlPressed, phase }) => {
  const classes = classNames('modal', phase, { hidden: ctrlPressed })
  return (
    <div id='modal' className={classes}>
      <Route path="/repair" component={RepairModal}/>
      <Route exact path="/research" component={ResearchContainer}/>
      <Route path="/research/results" component={ResearchResultsContainer}/>
      <Route exact path="/rockets" component={RocketAttackContainer}/>
      <Route path="/rockets/results" component={RocketResultsModal}/>
      <Route path="/purchase" component={PurchaseContainer}/>
      <Route path="/income" component={IncomeContainer}/>
      <Route path="/lend-lease" component={LendLeaseModal}/>
      <Route path="/plan-combat" component={PlanContainer}/>
      <Route path="/resolve-combat" component={CombatContainer}/>
      <Route path="/combat-rolls" component={CombatRollsContainer}/>
      <Route path="/select-casualties" component={SelectCasualtiesContainer}/>
      <Route path="/land-planes" component={PlaneLandingModal}/>
      <Route path="/russian-winter" component={RussianWinterModal}/>
      <Route path="/movement" component={MovementModal}/>
      <Route path="/placement" component={PlacementModal}/>
      <Route path="/carrier-loading" component={CarrierLoadingModal}/>
      <Route path="/confirm" component={EndCheckModal}/>
      <Route path="/order" component={DefenseOrderModal}/>
    </div>
  )
}

export default Modal


import React from 'react'
import classNames from 'classnames'
import { Route } from 'react-router-dom'
import RepairModal from '../repair/RepairModal'
import ResearchContainer from '../research/ResearchContainer'
import ResearchResultsContainer from '../researchResults/ResearchResultsContainer'
import RocketAttackModal from '../rocketAttack/RocketAttackModal'
import RocketResultsModal from '../rocketResults/RocketResultsModal'
import { PurchaseContainer } from '../purchases'
import { IncomeContainer } from '../income'
import LendLeaseModal from '../lendLease/LendLeaseModal'
import { PlanContainer } from '../planCombat'
import CombatModal from '../combat/CombatModal'
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
      <Route exact path="/rockets" component={RocketAttackModal}/>
      <Route path="/rockets/results" component={RocketResultsModal}/>
      <Route path="/purchase" component={PurchaseContainer}/>
      <Route path="/income" component={IncomeContainer}/>
      <Route path="/lend-lease" component={LendLeaseModal}/>
      <Route path="/plan-combat" component={PlanContainer}/>
      <Route path="/resolve-combat" component={CombatModal}/>
      <Route path="/plane-landing" component={PlaneLandingModal}/>
      <Route path="/russian-winter" component={RussianWinterModal}/>
      <Route path="/movement" component={MovementModal}/>
      <Route path="/placement" component={PlacementModal}/>
      <Route path="/carrier-loading" component={CarrierLoadingModal}/>
      <Route path="/confirm" component={EndCheckModal}/>
      <Route path="/order" component={DefenseOrderModal}/>
      <svg width="100" height="50" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="dieGradient" fx="30%" fy="30%">
            <stop offset="5%" stopColor="#333"></stop>
            <stop offset="95%" stopColor="#000"></stop>
          </radialGradient>
        </defs>
      </svg>
    </div>
  )
}

export default Modal


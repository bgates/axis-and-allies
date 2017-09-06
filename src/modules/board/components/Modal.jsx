import React from 'react'
import classNames from 'classnames'
import { Route } from 'react-router-dom'
import RepairModal from '../../repair/RepairModal'
import { ResearchContainer } from '../../research'
import ResearchResultsContainer from '../../researchResults/ResearchResultsContainer'
import RocketAttackContainer from '../../rocketAttack/RocketAttackContainer'
import RocketResultsModal from '../../rocketResults/RocketResultsModal'
import { PurchaseContainer } from '../../purchases'
import { IncomeContainer } from '../../income'
import LendLeaseModal from '../../lendLease/LendLeaseModal'
import { PlanContainer } from '../../planCombat'
import { StrategicBombModal } from '../../strategicBomb'
import { CombatContainer } from '../../combat'
import { CombatRollsContainer } from '../../combatRolls'
import { SelectCasualtiesContainer } from '../../selectCasualties'
import { LandPlanesContainer } from '../../landPlanes'
import RussianWinterModal from '../../russianWinter/RussianWinterModal'
import MovementContainer from '../../movement/MovementContainer'
import { PlacementContainer } from '../../placement'
import CarrierLoadingModal from '../../carrierLoading/CarrierLoadingModal'
import OrderUnitsModal from '../../orderUnits/OrderUnitsModal'

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
      <Route path="/strategic-bomb" component={StrategicBombModal}/>
      <Route path="/resolve-combat" component={CombatContainer}/>
      <Route path="/combat-rolls" component={CombatRollsContainer}/>
      <Route path="/select-casualties" component={SelectCasualtiesContainer}/>
      <Route path="/land-planes" component={LandPlanesContainer}/>
      <Route path="/russian-winter" component={RussianWinterModal}/>
      <Route path="/move-units" component={MovementContainer}/>
      <Route path="/place-units" component={PlacementContainer}/>
      <Route path="/load-carrier" component={CarrierLoadingModal}/>
      <Route path="/order-units" component={OrderUnitsModal}/>
    </div>
  )
}

export default Modal


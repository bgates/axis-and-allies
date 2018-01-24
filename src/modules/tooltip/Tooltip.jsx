import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { ImgAndQty } from '../../components/UnitFigure'
import '../../assets/styles/tooltip.css'
import industryImg from '../../assets/images/industrial_complex.png'
import PATHS from '../../paths'

const Units = ({ units }) => {
  return (
    <div>
      {units.map(unit => (
        <ImgAndQty key={unit.id} unit={unit} />
       ))}
    </div>
  )
}

const StartTooltip = ({ playing, currentPower, side }) => {
  if (playing) {
    return (
      <div>
        <p>This is the start of your turn. You are playing <strong>{currentPower}</strong> for the <strong>{side}</strong>.</p>
        <p>Click anywhere on the map to start.</p>
      </div>
    )
  } else {
    return (
      <div>
        <p>It is <strong>{currentPower}</strong>'s turn.</p>
        <p>You may send messages to other players while you wait for your next turn.</p>
      </div>
    )
  }
}

const RepairTooltip = () => {
  return (
    <div>
      <p><strong>Repair damaged capital ships.</strong> Click on any sea zone in which you have damaged capital ships (battleships or aircraft carriers) in a friendly naval base to repair the damage.</p> 
      <p>Territories with ships you can repair this turn are blinking. After you have reviewed each of these territories, you will be able to proceed to R&amp;D.</p>
      <p><strong>When you are satisfied with your choices for repair, click the &quot;Done&quot; button in the Indian Ocean.</strong></p>
    </div>
  )
}

const PlanCombatTooltip = () => {
  return (
    <div>
      <p><strong>Make your combat moves.</strong> Click on an enemy territory or sea zone you wish to attack, any sea zone you need to move supporting units to, or friendly territory you wish to blitz to.</p> 
      <p><strong>When you are done making your combat moves, click the &quot;Done&quot; button in the Indian Ocean.</strong></p>
    </div>
  )
}

const ResolveCombatTooltip = () => {
  return (
    <div>
      <p><strong>Resolve all combat.</strong> Click on an enemy territory or sea zone you are attacking. Territories with combat needing to be resolved are on fire, "The World at War"-style.</p>
      <p>You can choose the order in which the battles are fought, but you will not be able to fight more than one battle at a time. Each battle will need to be fully resolved in order to begin the next one. Amphibious assault units will need to have their sea zone battle resolved before the land battle can begin.</p>
    </div>
  )
}
 
const LandPlanesTooltip = () => {
  return (
    <div>
      <p><strong>Land all combat aircraft.</strong> Territories with combat aircraft needing to be landed are blinking.</p>
      <p>When you have landed all your combat aircraft and are ready to move to the next phase, click the &quot;Done&quot; button in the Indian Ocean.</p>
    </div>
  )
}

const NonCombatMovementTooltip = () => {
  return (
    <div>
      <p><strong>Make your non-combat moves.</strong> Click on any friendly territory or sea zone you wish to move units to.</p>
      <p>When you are done making your non-combat moves, click the <strong>Done</strong> button in the compass rose.</p>
      <p>You cannot move units used in combat this turn.</p>
      <p>Territories <strong>to</strong> which you have made non-combat moves will blink. You may click on those territories to change your moves.</p>
    </div>
  )
}

const OrderUnitsTooltip = () => {
  return (
    <div>
      <p><strong>Order combat units for defense.</strong>Click on any territory or sea zone in which you have combat units to set the order in which they will be eliminated when defending.</p>
      <p>Territories with multiple combat unit types whose defenses you have not reviewed this turn are blinking. Manually set the order for the units in as many territories as you like, then click the "Order by Cost" button.</p>
    </div>
  )
}

const ConfirmFinishTooltip = () => {
  return (
    <div>
      <p><strong>Click the Done button.</strong> If you are satisfied with your defensive assignments, click the <strong>Done</strong> button in the compass rose to end your turn.</p>
      <p>Click a territory to change defensive assignments for combat units.</p>
      <p><strong><span className="warning">Warning:</span> When you click the Done button, your turn will be over and you will not be able to undo any of your non-combat moves or change defensive assignments until your next turn.</strong></p>
    </div>
  )
}

const Tooltip = ({ 
  currentPower, 
  playing, 
  units, 
  industry, 
  territoryName,
  territoryValue,
  side,
  index
}) => {
  return (
    <div>
      <h1>
        {territoryName}
        {industry ? <img src={industryImg} alt="industrial complex" style={{height: 20}}/> : null}
        {territoryValue ? ` [${territoryValue}IPC]` : null}
      </h1>
      <Units units={units} />
      <Switch>
        <Route exact path="/" 
          render={() => <StartTooltip playing={playing} currentPower={currentPower} />} />
        <Route path={PATHS.REPAIR} component={RepairTooltip} />
        <Route path={PATHS.PLAN_ATTACKS} component={PlanCombatTooltip} />
        <Route path={PATHS.RESOLVE_COMBAT} component={ResolveCombatTooltip} />
        <Route path={PATHS.LAND_PLANES} component={LandPlanesTooltip} />
        <Route path={PATHS.PLAN_MOVEMENT} component={NonCombatMovementTooltip} />
        <Route path={PATHS.ORDER_UNITS} component={OrderUnitsTooltip} />
        <Route path={PATHS.CONFIRM_FINISH} component={ConfirmFinishTooltip} />
      </Switch>
    </div>
  )
}

export default Tooltip

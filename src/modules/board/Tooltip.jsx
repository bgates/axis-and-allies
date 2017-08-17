import React from 'react';
import { Route } from 'react-router-dom';
import { groupWith } from 'ramda';
import { ImgAndQty } from '../../components/UnitFigure';
import { matchingUnit } from '../../lib/Parser';
import { powerData } from '../../config/initialPowers';
import '../../assets/styles/tooltip.css';
import industryImg from '../../assets/images/industrial_complex.png';


const Units = ({ units, unitsFrom }) => {
  const combatUnits = units.filter(u => u.name !== 'industrial complex' && u.ids.length);
  const reducedUnitsFrom = groupWith(matchingUnit, unitsFrom).reduce((units, group) => {
    let ids = group.reduce((ids, u) => ids.concat(u.ids), []);
    let unit = { ...group[0], ids }
    return units.concat(unit)
  }, [])
  const consolidatedCombatUnits = combatUnits.concat(reducedUnitsFrom)
  return (
    <div>
      {consolidatedCombatUnits.map((unit, index) => (
        <ImgAndQty key={index} unit={unit} />
       ))}
    </div>
  )
}

const StartTooltip = ({ currentPower }) => {

  return(
    <div>
      <p>This is the start of your turn. You are playing <strong>{currentPower.name}</strong> for the <strong>{powerData[currentPower.name].side}</strong>.</p>
      <p>Click anywhere on the map to start.</p>
    </div>
  )
}

const RepairTooltip = () => {
  return (
    <table style={{ border: '2px solid #000000', backgroundColor: '#ffffff' }} cellPadding="0" width="300">
      <tbody>
        <tr><td></td></tr>
        <tr><td>resource</td></tr>
      </tbody>
    </table>
  )
}

const PlanCombatTooltip = () => {
  return (
    <div>
      <p><strong>Make your combat moves.</strong> Click on an enemy territory or sea zone you wish to attack, any sea zone you need to move supporting units to, or friendly territory you wish to blitz to.</p> 
      <p><strong>When you are done making your combat moves, click the &quot;Done&quot; button in the Indian Ocean.</strong></p>
      <p><strong className="warning">Warning:</strong> Any land or sea units moved during this phase can not be moved during the non-combat phase of your turn. Units on a transport that gets loaded or moved during this phase will only be allowed to unload from where they are. <strong className="notice">Use F.A.Q.s link above.</strong></p>
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
      <p><strong>Land all combat aircraft.</strong> Click on any territory or sea zone with combat aircraft to land. Territories with combat aircraft needing to be landed are blinking.</p>
      <p>When you have landed all your combat aircraft and are ready to move to the next phase, press the <b>Done</b> button in the compass rose.</p>
      <p>Aircraft cannot land in territories that were captured this turn. Aircraft do not have to endure antiaircraft fire during this phase.</p>
    </div>
  )
}

const Tooltip = ({ territory, currentPower }) => {
  const { units = [], unitsFrom = [] } = territory
  const industry = units.find(unit => unit.name === 'industrial complex')
  return (
    <div>
      <h1>{territory.name}{industry ? <img src={industryImg} alt="industrial complex" style={{height: 20}}/> : null}</h1>
      <Units units={units} unitsFrom={unitsFrom} />
      <Route exact path="/" 
        render={() => <StartTooltip currentPower={currentPower} />} />
      <Route path="/repair" component={RepairTooltip} />
      <Route path="/plan-combat" component={PlanCombatTooltip} />
      <Route path="/resolve-combat" component={ResolveCombatTooltip} />
      <Route path="/land-planes" component={LandPlanesTooltip} />
    </div>
  )
}

export default Tooltip
// 2 resources for repairRender
      //"370":"<b>Repair damaged capital ships.</b> Click on any sea zone in which you have damaged capital ships (battleships or aircraft carriers) in a friendly naval base to repair the damage. <p style=\"margin-top:5pxmargin-bottom:5px\">Territories with ships you can repair this turn are blinking. After you have reviewed each of these territories, you will be able to proceed to R&D.",
      //"371":"<b>Click the Done button.</b> If you are satisfied with your choices for repair, click the <b>Done</b> button in the compass rose to proceed with your turn.<p style=\"margin-top:5pxmargin-bottom:5px\">Click a sea zone to change repair decisions for capital ships.",

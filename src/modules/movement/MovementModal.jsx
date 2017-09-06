import React from 'react';
import ReactTooltip from 'react-tooltip';
import { unitMatch } from '../../lib/unit';
//import Attacker from './AttackerContainer';
//import Occupiers from './Occupiers';

const MovementModal = ({ territory, unitsInRange, planOtherMovement, combatants }) => {
  const attacker = (unit, key) => {
    let committed = territory.unitsFrom.find(u => unitMatch(u, unit, 'originIndex') && !u.mission) || { ids: [] };
    return (
      <div>unit</div>
      /*
      <Attacker 
        key={key}
        unit={unit}
        hasIndustry={hasIndustrialComplex(territory)}
        destinationIndex={territory.index}
        landAttack={!territory.sea}
        committed={committed} 
        />
        */
    )
  }
  return (
    <div>
      <a data-tip className="help">?</a>
      <h1>Non-Combat Movement</h1>
      <p>Moving to: {territory.name}</p>
      <ReactTooltip place="bottom" type="info">
        <p>To move units to this territory, move desired units in the "# Available" column to the "# Moved" column by pressing the <button>>></button> or <button>></button> buttons below. Remove units from the "# Attacking" column by pressing the <button>&lt;&lt;</button> or <button>&lt;</button> buttons below. Defending units are shown in the "Committed Units" column.</p>
        <p>Note that some units may have several movement options, so be sure to choose the desired movement option for each unit.</p>
        <hr/>
        <p>When you are done choosing units to move into this territory, press <button>ok</button></p>
      </ReactTooltip>
      <div className="planAttack">
        <div className="mobilizeAttack">
          <table
            className="outer scroll"
            cellSpacing={0} 
            cellPadding={1}>
            <thead>
              <tr>
                <th className="unit">Units Within Range:</th>
                <th className="available"># Available:</th>
                <th className="available"># Moved:</th>
              </tr>
            </thead>
            <tbody>
              {unitsInRange.map(attacker)}
              {unitsInRange.length === 0 ? <tr><td>You have no units in range.</td></tr> : null}
            </tbody>
          </table>
        </div>
        <div className="committedUnits">
          <h3>Committed Units</h3>
          {/*}<Occupiers 
            combatants={combatants}
            sea={territory.sea} />*/}
        </div>
      </div>
      <p>When you are done choosing units to move into this territory, press <button onClick={planOtherMovement}>ok</button></p>
    </div>
  )
}

export default MovementModal

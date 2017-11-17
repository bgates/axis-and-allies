import React from 'react'
import ReactTooltip from 'react-tooltip'
import { unitMatch } from '../../lib/unit'
import Attacker from '../planCombat/AttackerContainer'
import Occupiers from '../planCombat/Occupiers'

const MovementModal = ({ territory, committed, unitsInRange, landingSlots, occupants, planOtherMovement }) => {
  const attacker = (unit, key) => {
    return (
      <Attacker 
        key={key}
        unit={unit}
        committed={committed.filter(id => unit.ids.includes(id))}
        hasIndustry={false}
        targetIndex={territory.index}
        landAttack={!territory.sea}
        landingSlots={landingSlots}
       />
    )
  }
  return (
    <div>
      <a data-tip className="help">?</a>
      <h1>Non-Combat Movement</h1>
      <p>Moving to: {territory.name}</p>
      <ReactTooltip place="bottom" type="info">
        <p>To move units to this territory, move desired units in the "# Available" column to the "# Moved" column by pressing the <button>>></button> or <button>></button> buttons below. Remove units from the "# Moved" column by pressing the <button>&lt;&lt;</button> or <button>&lt;</button> buttons below. Units in {territory.name} are shown in the "Committed Units" column.</p>
        <p>Note that some units may have several movement options, so be sure to choose the desired movement option for each unit.</p>
        <hr/>
        <p>When you are done choosing units to move into this territory, press <button>ok</button></p>
      </ReactTooltip>
      <div className="unitSelector">
        <div>
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
          <Occupiers 
            combatants={occupants}
            sea={territory.sea} />
        </div>
      </div>
      <p>When you are done choosing units to move into this territory, press <button onClick={planOtherMovement}>ok</button></p>
    </div>
  )
}

export default MovementModal

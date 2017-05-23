import React from 'react';
import Transport from './Transport';
import { UnitFigTableData } from '../../components/UnitFigure';

const Attacker = ({ 
  unit, 
  committed, 
  strategicBombing,
  destinationIndex, 
  commitUnits, 
  unCommitUnits, 
  viewTransportLoadOptions, 
  landAttack, 
  hasIndustry }) => {
  if (unit.name === 'transport') {
    return (
      <Transport 
        unit={unit} 
        committed={committed}
        landAttack={landAttack}
        destinationIndex={destinationIndex}
        commitUnits={commitUnits}
        viewTransportLoadOptions={viewTransportLoadOptions}
        unCommitUnits={unCommitUnits} />
    )
  }
  return (
    <tr>
      <UnitFigTableData unit={unit} />
      <td className="available">
        <CommitButtons
          unit={unit} 
          index={destinationIndex}
          action={commitUnits} />
        {unit.air && hasIndustry && <AirOptions 
          unit={unit} 
          hasIndustry={hasIndustry} 
          index={destinationIndex} 
          action={commitUnits}
        />}
      </td>
      <td className="available">
        <UncommitButtons
          unit={unit} 
          index={destinationIndex}
          units={committed}
          action={unCommitUnits} />
        {unit.air && hasIndustry && <UncommitButtons
          unit={unit} 
          index={destinationIndex} 
          units={strategicBombing}
          action={unCommitUnits} 
        />}
      </td>
    </tr>
  )
}

const CommitButtons = ({ unit, index, action, mission }) => {
  const qty = unit.ids.length;
  return (
    <div>
      <input readOnly size={2} value={qty} />
      <button 
        onClick={e => { action(unit, index, mission, unit.ids)}}
        disabled={qty === 0}
      >&gt;&gt;</button>
      <button 
        onClick={e => { action(unit, index, mission, [unit.ids[0]])}}
        disabled={qty === 0}
      >&gt;</button>
    </div>
  )
}

const UncommitButtons = ({ unit, index, units, action }) => {
  const commitQty = units.ids.length;
  return (
    <div>
      <input readOnly size={2} value={commitQty} />
      <button 
        onClick={e => action(unit, index, units.ids)}
        disabled={commitQty === 0}
      >&lt;&lt;</button>
      <button 
        onClick={e => action(unit, index, [units.ids[0]])}
        disabled={commitQty === 0}
      >&lt;</button>
    </div>
  )
}

const AirOptions = ({ unit, hasIndustry, index, action }) => {
  let bombOrEscort = hasIndustry;
  if (bombOrEscort) {
    if (unit.name.includes('strategic')) {
      bombOrEscort = <span>Strategic bombing</span>
    } else {
      bombOrEscort = <span>Bomber escort</span>
    }
  }
  return (
    <div>
      {bombOrEscort}
      <CommitButtons
        unit={unit} 
        index={index}
        action={action}
        mission={'strategicBomb'}/>
    </div>
  )
}

export default Attacker;

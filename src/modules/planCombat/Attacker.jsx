import React from 'react';
import Transport from './Transport';
import { UnitFigTableData } from '../../components/UnitFigure';
import { STRATEGIC_BOMB } from '../../actions';
import { unitCount } from '../../lib/unit';

const Attacker = ({ 
  unit, 
  committed, 
  strategicBombing,
  destinationIndex, 
  commitUnits, 
  unCommitUnits, 
  commitAmphibUnits,
  unCommitAmphibUnits,
  viewTransportLoadOptions, 
  landAttack, 
  landingSlots,
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
        unCommitUnits={unCommitUnits} 
        commitAmphibUnits={commitAmphibUnits}
        unCommitAmphibUnits={unCommitAmphibUnits}
      />
    )
  }
  return (
    <tr>
      <UnitFigTableData unit={unit} />
      <td className="available">
        <CommitButtons
          unit={unit} 
          index={destinationIndex}
          landingSlots={landingSlots}
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

const CommitButtons = ({ unit, index, action, landingSlots, mission }) => {
  const qty = unitCount(unit);
  const allDisabled = qty === 0 || (unit.air && qty > landingSlots)
  const oneDisabled = qty === 0 || (unit.air && !landingSlots)
  return (
    <div>
      <input readOnly size={2} value={qty} />
      <button 
        onClick={e => { action(unit, index, mission, unit.ids)}}
        disabled={allDisabled}
      >&gt;&gt;</button>
      <button 
        onClick={e => { action(unit, index, mission, [unit.ids[0]])}}
        disabled={oneDisabled}
      >&gt;</button>
    </div>
  )
}

const UncommitButtons = ({ unit, index, units, action }) => {
  const commitQty = unitCount(units);
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
        mission={STRATEGIC_BOMB}/>
    </div>
  )
}

export default Attacker;

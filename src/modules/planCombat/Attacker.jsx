import React from 'react'
import { UnitFigTableData } from '../../components/UnitFigure'
import unitTypes from '../../config/unitTypes'

const Attacker = ({ 
  unit, 
  committed, 
  strategicBombing,
  destinationIndex, 
  landingSlots,
  hasIndustry,
  commitUnits, 
  unCommitUnits, 
  commitToStrategicBombing
}) => {
  const air = unitTypes[unit.type].air
  return (
    <tr>
      <UnitFigTableData unit={unit} />
      <td className="available">
        <CommitButtons
          unit={unit} 
          committed={committed}
          destinationIndex={destinationIndex}
          air={air}
          landingSlots={landingSlots}
          action={commitUnits} />
        {air && hasIndustry && <AirOptions 
          unit={unit} 
          committed={committed}
          landingSlots={landingSlots}
          destinationIndex={destinationIndex} 
          action={commitToStrategicBombing}
        />}
      </td>
      <td className="available">
        <UncommitButtons
          destinationIndex={destinationIndex}
          committed={committed.filter(id => !strategicBombing.includes(id))}
          action={unCommitUnits} />
        {air && hasIndustry && <UncommitButtons
          unit={unit} 
          committed={strategicBombing}
          destinationIndex={destinationIndex} 
          units={strategicBombing}
          action={unCommitUnits} 
        />}
      </td>
    </tr>
  )
}

const CommitButtons = ({ 
  unit, 
  committed,
  destinationIndex, 
  action, 
  air, 
  landingSlots 
}) => {
  const { ids, originIndex } = unit
  const available = ids.filter(id => !committed.includes(id))
  const qty = available.length
  const allDisabled = qty === 0 || (air && qty > landingSlots)
  const oneDisabled = qty === 0 || (air && !landingSlots)
  return (
    <div>
      <input readOnly size={2} value={qty} />
      <button 
        onClick={e => { action(originIndex, destinationIndex, available)}}
        disabled={allDisabled}
      >&gt;&gt;</button>
      <button 
        onClick={e => { action(originIndex, destinationIndex, [available[0]])}}
        disabled={oneDisabled}
      >&gt;</button>
    </div>
  )
}

const UncommitButtons = ({ 
  unit, 
  committed,
  destinationIndex, 
  action 
}) => {
  const commitQty = committed.length
  return (
    <div>
      <input readOnly size={2} value={commitQty} />
      <button 
        onClick={e => action(destinationIndex, committed)}
        disabled={commitQty === 0}
      >&lt;&lt;</button>
      <button 
        onClick={e => action(destinationIndex, [committed[0]])}
        disabled={commitQty === 0}
      >&lt;</button>
    </div>
  )
}

const AirOptions = ({ 
  unit, 
  committed,
  destinationIndex, 
  landingSlots,
  action 
}) => (
  <div>
    <CommitButtons
      unit={unit} 
      air={true}
      committed={committed}
      destinationIndex={destinationIndex}
      landingSlots={landingSlots}
      action={action}
    />
    <span>{unit.type.includes('strategic') ? 'Strategic bombing' : 'Bomber escort'}</span>
  </div>
)

export default Attacker

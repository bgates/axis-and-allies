import React from 'react'
import { UnitFigTableData } from './UnitFigure'
import { air as isAir } from '../selectors/units'

const Attacker = ({ 
  unit, 
  committed, 
  strategicBombing,
  targetIndex, 
  landingSlots,
  hasIndustry,
  commitUnits, 
  unCommitUnits, 
  commitToStrategicBombing
}) => {
  const air = isAir(unit)
  strategicBombing = strategicBombing || []
  return (
    <tr>
      <UnitFigTableData unit={unit} />
      <td className="available">
        <CommitButtons
          unit={unit} 
          committed={committed}
          targetIndex={targetIndex}
          air={air}
          landingSlots={landingSlots}
          action={commitUnits} />
        {air && hasIndustry && <AirOptions 
          unit={unit} 
          committed={committed}
          landingSlots={landingSlots}
          targetIndex={targetIndex} 
          action={commitToStrategicBombing}
        />}
      </td>
      <td className="available">
        <UncommitButtons
          targetIndex={targetIndex}
          committed={committed.filter(id => !strategicBombing.includes(id))}
          action={unCommitUnits} />
        {air && hasIndustry && <UncommitButtons
          unit={unit} 
          committed={strategicBombing.filter(id => unit.ids.includes(id))}
          targetIndex={targetIndex} 
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
  targetIndex, 
  action, 
  air, 
  landingSlots 
}) => {
  const { distance, ids, originIndex } = unit
  const available = ids.filter(id => !committed.includes(id))
  const qty = available.length
  const allDisabled = qty === 0 || (air && qty > landingSlots)
  const oneDisabled = qty === 0 || (air && !landingSlots)
  return (
    <div>
      <input readOnly size={2} value={qty} />
      <button 
        onClick={e => { action(originIndex, targetIndex, available, air && distance)}}
        disabled={allDisabled}
      >&gt;&gt;</button>
      <button 
        onClick={e => { action(originIndex, targetIndex, [available[0]], air && distance)}}
        disabled={oneDisabled}
      >&gt;</button>
    </div>
  )
}

const UncommitButtons = ({ 
  unit, 
  committed,
  targetIndex, 
  action 
}) => {
  const commitQty = committed.length
  return (
    <div>
      <input readOnly size={2} value={commitQty} />
      <button 
        onClick={e => action(targetIndex, committed)}
        disabled={commitQty === 0}
      >&lt;&lt;</button>
      <button 
        onClick={e => action(targetIndex, [committed[0]])}
        disabled={commitQty === 0}
      >&lt;</button>
    </div>
  )
}

const AirOptions = ({ 
  unit, 
  committed,
  targetIndex, 
  landingSlots,
  action 
}) => (
  <div>
    <CommitButtons
      unit={unit} 
      air={true}
      committed={committed}
      targetIndex={targetIndex}
      landingSlots={landingSlots}
      action={action}
    />
    <span>{unit.type.includes('strategic') ? 'Strategic bombing' : 'Bomber escort'}</span>
  </div>
)

export default Attacker


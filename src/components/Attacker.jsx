import React from 'react'
import { UnitFigTableData } from './UnitFigure'
import { air as isAir } from '../selectors/units'

const Attacker = ({ 
  unit, 
  committed, 
  strategicBombing,
  targetIndex, 
  landingSlots,
  mayNotCommitToStrategicBombing,
  mayNotUncommitFromStrategicBombing,
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
          mayNotCommitToStrategicBombing={mayNotCommitToStrategicBombing}
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
          mayNotUncommitFromStrategicBombing={mayNotUncommitFromStrategicBombing}
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
  landingSlots,
  mayNotCommitToStrategicBombing
}) => {
  const { distance, ids, originIndex } = unit
  const available = ids.filter(id => !committed.includes(id))
  const qty = available.length
  const allDisabled = qty === 0 || (air && qty > landingSlots) || mayNotCommitToStrategicBombing
  const oneDisabled = qty === 0 || (air && !landingSlots) || mayNotCommitToStrategicBombing
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

//TODO: prevent carrier from withdrawing if air units are expecting to land on it
const UncommitButtons = ({ 
  unit, 
  committed,
  targetIndex, 
  action,
  mayNotUncommitFromStrategicBombing
}) => {
  const commitQty = committed.length
  return (
    <div>
      <input readOnly size={2} value={commitQty} />
      <button 
        onClick={e => action(targetIndex, committed)}
        disabled={commitQty === 0 || mayNotUncommitFromStrategicBombing} 
      >&lt;&lt;</button>
      <button 
        onClick={e => action(targetIndex, [committed[0]])}
        disabled={commitQty === 0 || mayNotUncommitFromStrategicBombing}
      >&lt;</button>
    </div>
  )
}

const AirOptions = ({ 
  unit, 
  committed,
  targetIndex, 
  landingSlots,
  action,
  mayNotCommitToStrategicBombing
}) => (
  <div>
    <CommitButtons
      unit={unit} 
      air={true}
      committed={committed}
      targetIndex={targetIndex}
      landingSlots={landingSlots}
      action={action}
      mayNotCommitToStrategicBombing={mayNotCommitToStrategicBombing}
    />
    <span>{unit.type.includes('strategic') ? 'Strategic bombing' : 'Bomber escort'}</span>
  </div>
)

export default Attacker

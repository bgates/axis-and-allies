import React from 'react';
import ReactTooltip from 'react-tooltip';
import { UnitFigTableData } from '../../components/UnitFigure';

const Bombardment = ({ 
  territory, 
  bombardmentCapableUnits, 
  commitBombardmentUnits, 
  uncommitBombardmentUnits, 
  resolveCombat
}) => {
  return (
    <div>
      <a data-tip className="help">?</a>
      <h1>Naval Support for Assault on {territory.name}</h1>
      <ReactTooltip place="bottom" type="info">
        <p>A battleship or cruiser that has not engaged in naval combat is eligible to support an amphibious assault on an adjacent territory.</p>
        <p>Defenders cannot hit naval vessels.</p>
      </ReactTooltip>
      <table
        className="outer scroll"
        cellSpacing={0} 
        cellPadding={1}>
        <tbody>
        {bombardmentCapableUnits.map((unit, index) => ( 
          <Bombarder
            key={index}
            commitUnits={commitBombardmentUnits}
            unCommitUnits={uncommitBombardmentUnits}
            territory={territory}
            unit={unit} />
        ))}
        </tbody>
      </table>
      <p>When you have selected the units you want to engage in shore bombardment, press <button onClick={resolveCombat.bind(null, territory.index)}>continue</button></p>
    </div> 
  )
}

export default Bombardment

const Bombarder = ({ 
  unit, 
  territory, 
  commitUnits, 
  unCommitUnits, 
}) => {
  const available = unit.bombard ? unit.ids.filter(id => !unit.bombard[id]) : unit.ids
  const committed = unit.bombard ? unit.ids.filter(id => unit.bombard[id] === territory.index) : []
  return (
    <tr>
      <UnitFigTableData unit={unit} />
      <td className="available">
        <CommitButtons
          unit={unit} 
          targetIndex={territory.index}
          available={available}
          action={commitUnits} />
      </td>
      <td className="available">
        <UncommitButtons
          unit={unit} 
          targetIndex={territory.index}
          committed={committed}
          action={unCommitUnits} />
      </td>
    </tr>
  )
}

const CommitButtons = ({ unit, targetIndex, available, action }) => {
  const disabled = available.length === 0
  return (
    <div>
      <input readOnly size={2} value={available.length} />
      <button 
        onClick={e => { action(unit, unit.locationIndex, targetIndex, available)}}
        disabled={disabled}
      >&gt;&gt;</button>
      <button 
        onClick={e => { action(unit, unit.locationIndex, targetIndex, [available[0]])}}
        disabled={disabled}
      >&gt;</button>
    </div>
  )
}

const UncommitButtons = ({ unit, targetIndex, committed, action }) => {
  const commitQty = committed.length
  return (
    <div>
      <input readOnly size={2} value={commitQty} />
      <button 
        onClick={e => action(unit, unit.locationIndex, targetIndex, committed)}
        disabled={commitQty === 0}
      >&lt;&lt;</button>
      <button 
        onClick={e => action(unit, unit.locationIndex, targetIndex, [committed[0]])}
        disabled={commitQty === 0}
      >&lt;</button>
    </div>
  )
}

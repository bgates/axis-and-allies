import React from 'react'
import { Link } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'
import { UnitImg } from '../../components/UnitFigure'

const PlacementModal = ({ 
  industrialComplexes, 
  shipyards, 
  purchases,
  placements,
  availables,
  currentPower,
  commitUnitPlacement,
  commitAllUnitPlacement,
  unCommitUnitPlacement,
  unCommitAllUnitPlacement
}) => {
  console.log(placements)
  return (
    <div>
      <a data-tip className="help">?</a>
      <h1>Place Units</h1>
      <ReactTooltip place="bottom">
        <p><strong>Place the new units you purchased at the beginning of your turn.</strong> New land units must be placed in territories with an industrial complex that you held before combat this turn. New sea units must be placed in a friendly sea zone immediately adjacent to an industrial complex that you held before combat this turn.</p>
        <p>You may place new sea units in a sea zone you captured this turn.</p>
      </ReactTooltip>
      <table cellPadding={0} cellSpacing={0} className="placement">
        <tbody>
          <tr>
            <th>Unit</th>
            <th>Available</th>
            <th>Territory</th>
            <th>Commit</th>
            <th>Committed</th>
            <th>Uncommit</th>
          </tr>
        </tbody>
        {Object.keys(purchases).map(unit => ( 
          <PlacementRows 
            key={unit}
            unit={unit} 
            power={currentPower}
            complexes={industrialComplexes} 
            placements={placements[unit] || {}}
            available={availables[unit]}
            commit={commitUnitPlacement}
            uncommit={unCommitUnitPlacement}
            commitAll={commitAllUnitPlacement}
            uncommitAll={unCommitAllUnitPlacement}
          />
        ))}
      </table>
      <nav>
        <Link to="/" className="btn">Back</Link>
        <Link to="/confirm" className="btn">Place</Link>
      </nav>
    </div>
  )
}

export default PlacementModal

const PlacementRows = (props) => {
  return (
    <tbody className="placement">
      {props.complexes.map((territory, index) => (
        <PlacementRow 
          key={index}
          i={index}
          territory={territory} 
          complexCount={props.complexes.length}
          {...props}
        />
      ))}
    </tbody>
  )
}

const PlacementRow = ({ 
  unit, 
  i, 
  territory, 
  available,
  placements,
  complexCount,
  power,
  commit,
  uncommit,
  commitAll,
  uncommitAll
}) => {
  const { index, name } = territory;
  return (
    <tr>
      {i === 0 ? <td rowSpan={complexCount}><UnitImg name={unit} power={power.name} /></td> : null}
      {i === 0 ? <td rowSpan={complexCount}><input readOnly size={2} value={available}/></td> : null}
      <td>{name}</td>
      <td>
        <button 
          disabled={available === 0}
          onClick={()=> commit(unit, index)}>&gt;</button>
        <button 
          disabled={available === 0}
          onClick={()=> commitAll(unit, index, available)}>&gt;&gt;</button>
      </td>
      <td><input readOnly size={2} value={placements[index] || 0}/></td>
      <td>
        <button onClick={()=> uncommitAll(unit, index)}>&lt;&lt;</button>
        <button onClick={()=> uncommit(unit, index)}>&lt;</button>
      </td>
    </tr>
  )
}

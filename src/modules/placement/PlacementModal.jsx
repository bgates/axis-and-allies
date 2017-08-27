import React from 'react'
import { Link } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'
import { UnitImg } from '../../components/UnitFigure'

const PlacementModal = ({ 
  industrialComplexes, 
  shipyards, 
  purchases,
  currentPower
}) => {
  console.log(industrialComplexes)
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
            count={purchases[unit]} 
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

const PlacementRows = ({ unit, complexes, count, power }) => {
  return (
    <tbody className="placement">
      {complexes.map((territory, index) => (
        <PlacementRow 
          key={index}
          index={index}
          unit={unit} 
          power={power.name}
          territory={territory} 
          count={count}
          complexCount={complexes.length}
        />
      ))}
    </tbody>
  )
}

const PlacementRow = ({ 
  unit, 
  index, 
  territory, 
  count, 
  complexCount,
  power
}) => {
  return (
    <tr>
      {index === 0 ? <td rowSpan={complexCount}><UnitImg name={unit} power={power} /></td> : null}
      <td><input readOnly size={2} value={count}/></td>
      <td>{territory.name}</td>
      <td><button>&gt;</button><button>&gt;&gt;</button></td>
      <td><input readOnly size={2} value={0}/></td>
      <td><button>&lt;&lt;</button><button>&lt;</button></td>
    </tr>
  )
}

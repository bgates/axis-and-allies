import React from 'react'
import { Link } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'
import { UnitImg } from '../../components/UnitFigure'
import unitTypes from '../../config/unitTypes'

const PlacementModal = ({ 
  availables,
  currentPower,
  industrialComplexes, 
  placements,
  previousPhase,
  purchases,
  shipyards, 
  place,
  commitUnitPlacement,
  commitAllUnitPlacement,
  unCommitUnitPlacement,
  unCommitAllUnitPlacement
}) => {
  console.log({ industrialComplexes, unitTypes })
  return (
    <div>
      <a data-tip className="help">?</a>
      <h1>Place Units</h1>
      <ReactTooltip place="bottom">
        <p><strong>Place the new units you purchased at the beginning of your turn.</strong> New land units must be placed in territories with an industrial complex that you held before combat this turn. New sea units must be placed in a friendly sea zone immediately adjacent to an industrial complex that you held before combat this turn.</p>
        <p>Each industrial complex has a production capacity equal to seven times its IPC value per turn. For instance, West Germany (4 IPC) can produce units with an aggregate cost of 28 IPCs, while Moscow (6 IPC) can produce units with an aggregate cost of 42 IPCs.</p>
        <p>You may place new sea units in a sea zone you cleared of enemy units this turn.</p>
      </ReactTooltip>
      <table cellPadding={0} cellSpacing={0} className="placement">
        {currentPower === 'China' ? <ChineseHeader /> : <ProductionHeader complexes={industrialComplexes} />}
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
        <Link to={previousPhase} className="btn">Back</Link>
        <button onClick={place} className="btn">Place</button>
      </nav>
    </div>
  )
}

export default PlacementModal

const ChineseHeader = () => (
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
)

const ProductionHeader = ({ complexes }) => (
  <tbody>
    <tr>
      <th colSpan={2}>Territory</th>
      <th colSpan={2}>Used Capacity</th>
      <th colSpan={2}>Remaining Capacity</th></tr>
    {complexes.map(complex => (
      <tr>
        <td colSpan={2}>{complex.name}</td>
        <td colSpan={2}>{complex.usedCapacity}</td>
        <td colSpan={2}>{complex.remainingCapacity}</td>
      </tr>
    ))}
    <tr>
      <th>Unit</th>
      <th>Available</th>
      <th>Territory</th>
      <th>Commit</th>
      <th>Committed</th>
      <th>Uncommit</th>
    </tr>
  </tbody>
)
const PlacementRows = (props) => (
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
  const { index, name, remainingCapacity } = territory
  const cost = power === 'China' ? 1 : unitTypes[unit].cost
  const oneDisabled = available === 0 || remainingCapacity < cost
  const allDisabled = available === 0 || remainingCapacity < cost * available
  const backDisabled = !placements[index]
  return (
    <tr>
      {i === 0 ? <td rowSpan={complexCount}><UnitImg name={unit} power={power} /></td> : null}
      {i === 0 ? <td rowSpan={complexCount}><input readOnly size={2} value={available}/></td> : null}
      <td>{name}</td>
      <td>
        <button 
          disabled={oneDisabled}
          onClick={()=> commit(unit, index)}>&gt;</button>
        <button 
          disabled={allDisabled}
          onClick={()=> commitAll(unit, index, available)}>&gt;&gt;</button>
      </td>
      <td><input readOnly size={2} value={placements[index] || 0}/></td>
      <td>
        <button disabled={backDisabled} onClick={()=> uncommitAll(unit, index)}>&lt;&lt;</button>
        <button disabled={backDisabled} onClick={()=> uncommit(unit, index)}>&lt;</button>
      </td>
    </tr>
  )
}

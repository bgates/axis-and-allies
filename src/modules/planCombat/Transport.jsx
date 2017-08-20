import React from 'react';
import { UnitFigTableData, TransportFigure } from '../../components/UnitFigure';

const Transport = ({ unit, committed, ...props }) => {
  return <tbody>
    {unit.ids.map(id => (
      <TransportRow
        key={id}
        unit={unit}
        id={id}
        available={true}
        {...props} />
    ))}
    {committed.ids.map(id => (
      <TransportRow
        key={id}
        unit={unit}
        id={id}
        available={false}
        {...props} />
    ))}
  </tbody>
}

const AmphibiousAssault = ({ 
  unit, 
  id, 
  destinationIndex,
  commitAmphibUnits,
  unCommitAmphibUnits 
}) => {
  const amphibiousUnits = unit.cargo[id];
  return (
    <tr>
      <td className="unit">
        <strong>{unit.originName}[amphib]</strong>
        {amphibiousUnits.map((unit, index) => (        
          <TransportFigure unit={unit} key={index} />
        ))}
      </td>
      <td className="available">
        <input readOnly size={2} value={1} />
        <button 
          onClick={e => { commitAmphibUnits(unit, destinationIndex, id)}}
        >&gt;&gt;</button>
      </td>
      <td className="available">
        <input readOnly size={2} value={0} />
        <button 
          onClick={e => unCommitAmphibUnits(unit, destinationIndex, id)}
        >&lt;</button>
      </td>
    </tr>
  )
}
const TransportRow = ({ 
  unit, 
  destinationIndex, 
  commitUnits, 
  unCommitUnits, 
  viewTransportLoadOptions, 
  available, 
  id, 
  landAttack,
  commitAmphibUnits,
  unCommitAmphibUnits 
}) => {
  if (landAttack) {
    return <AmphibiousAssault 
      unit={unit}
      id={id}
      destinationIndex={destinationIndex}
      commitAmphibUnits={commitAmphibUnits}
      unCommitAmphibUnits={unCommitAmphibUnits}
    />
  }
  return (
    <tr>
      <UnitFigTableData unit={unit} />
      <td className="available">
        <input readOnly size={2} value={available ? 1 : 0} />
        <button 
          onClick={e => { viewTransportLoadOptions(unit, id)}}
          disabled={!available}
        >Load</button>
        <button 
          onClick={e => commitUnits(unit, destinationIndex, [id])}
          disabled={!available || unit.originIndex === destinationIndex}
        >&gt;</button>
        {unit.cargo ? <span>carrying ...</span> : ''}
      </td>
      <td className="available">
        <input readOnly size={2} value={available ? 0 : 1} />
        <button 
          onClick={e => unCommitUnits(unit, destinationIndex, [id])}
          disabled={available}
        >&lt;</button>
        <span>attacks @{unit.attack}</span>
      </td>
    </tr>
  )
}

export default Transport;

import React from 'react'
import { TransportFigure } from '../../components/UnitFigure'

const AmphibiousAssault = ({ 
  unit, 
  id, 
  destinationIndex,
  commitAmphibUnits,
  unCommitAmphibUnits 
}) => {
  const amphibiousUnits = unit.cargo[id]
  const amphibCommitted = (unit.cargoDestinations || {})[id]
  const committedHere = amphibCommitted === destinationIndex
  return (
    <tr>
      <td className="unit">
        <strong>{unit.originName}[amphib]</strong>
        {amphibiousUnits.map((unit, index) => (        
          <TransportFigure unit={unit} key={index} />
        ))}
      </td>
      <td className="available">
        <input readOnly size={2} value={amphibCommitted ? 0 : 1} />
        <button 
          disabled={amphibCommitted}
          onClick={e => { commitAmphibUnits(unit, destinationIndex, id)}}
        >&gt;&gt;</button>
      </td>
      <td className="available">
        <input readOnly size={2} value={committedHere ? 1 : 0} />
        <button 
          disabled={!amphibCommitted}
          onClick={e => unCommitAmphibUnits(unit, destinationIndex, id)}
        >&lt;</button>
      </td>
    </tr>
  )
}
export default AmphibiousAssault

import React from 'react'
import { TransportFigure } from '../../components/UnitFigure'

const AmphibiousAssault = ({ 
  unit: { id, originName }, 
  amphibiousUnits, 
  destinationIndex,
  commitAmphibUnits,
  unCommitAmphibUnits 
}) => {
  const amphibCommitted = false //TODO: fix
  const committedHere = amphibCommitted === destinationIndex
  const amphibIds = amphibiousUnits.map(unit => unit.id)
  return (
    <tr>
      <td className="unit">
        <strong>{originName}[amphib]</strong>
        {amphibiousUnits.map((unit, index) => (        
          <TransportFigure unit={unit} key={index} />
        ))}
      </td>
      <td className="available">
        <input readOnly size={2} value={amphibCommitted ? 0 : 1} />
        <button 
          disabled={amphibCommitted}
          onClick={e => { commitAmphibUnits(id, destinationIndex, amphibIds)}}
        >&gt;&gt;</button>
      </td>
      <td className="available">
        <input readOnly size={2} value={committedHere ? 1 : 0} />
        <button 
          disabled={!amphibCommitted}
          onClick={e => unCommitAmphibUnits(id, destinationIndex, amphibIds)}
        >&lt;</button>
      </td>
    </tr>
  )
}
export default AmphibiousAssault

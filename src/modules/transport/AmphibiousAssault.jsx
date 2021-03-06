import React from 'react'
import { TransportFigure } from '../../components/UnitFigure'

const AmphibiousAssault = ({ 
  unit: { id, originName }, 
  amphibiousUnits, 
  committedHere,
  targetIndex,
  commitAmphibUnits,
  unCommitAmphibUnits 
}) => {
  return (
    <tr>
      <td className="unit">
        <strong>{originName}[amphib]</strong>
        {amphibiousUnits.map((unit, index) => (        
          <TransportFigure unit={unit} key={index} />
        ))}
      </td>
      <td className="available">
        <input readOnly size={2} value={committedHere ? 0 : 1} />
        <button 
          disabled={committedHere}
          onClick={e => { commitAmphibUnits(id, targetIndex)}}
        >&gt;&gt;</button>
      </td>
      <td className="available">
        <input readOnly size={2} value={committedHere ? 1 : 0} />
        <button 
          disabled={!committedHere}
          onClick={e => unCommitAmphibUnits(id, targetIndex)}
        >&lt;</button>
      </td>
    </tr>
  )
}
export default AmphibiousAssault

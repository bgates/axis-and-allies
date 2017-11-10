import React from 'react'
import { UnitImg } from './UnitFigure'

const Forces = ({ units, classNameFct, handleClick }) => {
  return (
    <div>
      {units.map(({ id, power, type })=> (
        <UnitImg 
          key={id} 
          power={power} 
          className={classNameFct(id)}
          handleClick={handleClick(id)}
          name={type} />
        ))
      }
    </div>
  )
}
Forces.defaultProps = {
  classNameFct: () => null,
  handleClick: () => null
}
export default Forces

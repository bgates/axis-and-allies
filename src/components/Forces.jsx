import React from 'react'
import { UnitImg } from './UnitFigure'

const Forces = ({ units, classNameFct, handleClick }) => (
  <div>
    {units.map(({ id, power, type })=> (
      <UnitImg 
        key={id} 
        power={power} 
        className={classNameFct(id)}
        handleClick={handleClick(id, type)}
        name={type} />
      ))
    }
  </div>
)

Forces.defaultProps = {
  classNameFct: () => null,
  handleClick: () => null
}
export default Forces

import React from 'react';
import { UnitImg } from './UnitFigure'

const Forces = ({ units, filterFct, classNameFct, handleClick }) => {
  return (
    <div>
      {units.map(unit => ( 
        unit.ids.filter(filterFct).map(id => (
          <UnitImg 
            key={id} 
            power={unit.power} 
            className={classNameFct(id)}
            handleClick={handleClick(id)}
            name={unit.name} />
        ))
      ))}
    </div>
  )
}
Forces.defaultProps = {
  filterFct: (id) => id,
  classNameFct: () => null,
  handleClick: () => null
}
export default Forces;

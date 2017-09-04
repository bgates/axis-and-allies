import React from 'react';
import { UnitImg } from './UnitFigure'

const Forces = ({ units, filterFct, classNameFct, handleClick }) => {
  const unitIds = units.reduce((total, unit) => (
    total.concat(unit.ids.filter(filterFct).map(id => ({ unit, id })))
  ), [])
  return (
    <div>
      {unitIds.map(({ unit, id }) => (
        <UnitImg 
          key={id} 
          power={unit.power} 
          className={classNameFct(id)}
          handleClick={handleClick(id)}
          name={unit.name} />
        ))
      }
    </div>
  )
}
Forces.defaultProps = {
  filterFct: (id) => id,
  classNameFct: () => null,
  handleClick: () => null
}
export default Forces;

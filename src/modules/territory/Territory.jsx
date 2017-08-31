import React from 'react';

const Territory = ({ 
  territory, 
  classNames,
  handleClick, 
  setVisibility, 
  fill
}) => {
  const { dimensions, adjacentIndexes, name } = territory;
  return (
    <path d={dimensions}
      id={adjacentIndexes === null ? name.toLowerCase().replace(/\s/,'_') : null}
      className={classNames}
      stroke='#000'
      strokeWidth='2'
      onClick={handleClick.bind(null, territory)}
      onMouseOver={setVisibility}
      fill={fill} >
    </path>
  )
}

export default Territory

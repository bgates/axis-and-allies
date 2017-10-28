import React from 'react'

const Territory = ({ 
  territory, 
  classNames,
  handleClick, 
  setVisibility, 
  fill,
  playing
}) => {
  const { dimensions, adjacentIndexes, name } = territory;
  return (
    <path d={dimensions}
      id={adjacentIndexes ? null : name.toLowerCase().replace(/\s/,'_')}
      className={classNames}
      stroke='#000'
      strokeWidth='2'
      onClick={playing && handleClick.bind(null, territory)}
      onMouseOver={setVisibility}
      fill={fill} >
    </path>
  )
}

export default Territory

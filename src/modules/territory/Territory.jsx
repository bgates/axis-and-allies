import React from 'react'

const Territory = ({ 
  territoryIndex, 
  dimensions,
  classNames,
  fill,
  id,
  handleClick, 
  setVisibility, 
  playing
}) => {
  return (
    <path d={dimensions}
      id={id}
      className={classNames}
      stroke="#000"
      strokeWidth="2"
      fill={fill} 
      onClick={playing && handleClick}
      onMouseOver={setVisibility} >
    </path>
  )
}

export default Territory

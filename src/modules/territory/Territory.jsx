// @flow
import React from 'react'

type Props = {
  territoryIndex: number,
  dimensions: string,
  classNames: string,
  fill: string,
  id: number,
  handleClick: () => void,
  setVisibility: () => void,
  playing: boolean
}
const Territory = (props:Props) => { 
  const {
    territoryIndex, 
    dimensions,
    classNames,
    fill,
    id,
    handleClick, 
    setVisibility, 
    playing
  } = props
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

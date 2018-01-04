import React from 'react'
import Die from './Die'
import roll from '../lib/dieRollRotation'

const Dice = ({ rolls, goalFunction, handleReveal }) => (
  <div>
    {rolls.map((die) => roll(die)).map((rotation, i) => (
      <Die 
        key={i}
        metGoal={goalFunction(rolls[i])}
        reveal={handleReveal}
        rotateX={rotation[0]}
        rotateY={rotation[1]} />
    ))}
    <svg width="100" height="50" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="dieGradient" fx="30%" fy="30%">
          <stop offset="5%" stopColor="#333"></stop>
          <stop offset="95%" stopColor="#000"></stop>
        </radialGradient>
      </defs>
    </svg>
  </div>
)
export default Dice

import React from 'react';
import Die from './Die';
import roll from '../lib/dieRollRotation'

const Dice = ({ rolls, goalFunction, handleReveal }) => {
  return (
    <div>
      {rolls.map((die) => roll(die)).map((rotation, i) => {
        return (
          <Die 
            key={i}
            metGoal={goalFunction(rolls[i])}
            reveal={handleReveal}
            rotateX={rotation[0]}
            rotateY={rotation[1]} />
        )
      })}
    </div>
  )
}
export default Dice;

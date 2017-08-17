import React from 'react'

const BattleStatus = ({ 
  victor,
  casualtyCount, 
  casualties, 
  nextStep,
  territoryIndex
}) => {
  let disabled, span = '', btn = 'Continue';
  if (!casualtyCount) {
    span = 'Everybody missed!'
  } else {
    if (victor === 'defender') {
      span = 'Attackers lose!'
    } else if (victor) {
      span = 'Defenders lose! '
    } 
    if (victor !== 'defender') {
      const count = casualtyCount - casualties.length;
      const casualtyWord = casualtyCount === 1 ? 'casualty' : 'casualties';
      span += `Mark ${count} ${casualtyWord}.`
      disabled = casualties.length < casualtyCount
      btn = 'Remove Casualties'
    }
  }
  return (
    <nav>
      <span>{span}</span>
      <button 
        onClick={(e) => { nextStep(victor, territoryIndex) }} 
        disabled={disabled}>{btn}
      </button>
    </nav>
  )
}

export default BattleStatus

import React from 'react'

const BattleStatus = ({ 
  victor,
  casualtyCount, 
  casualties, 
  nextStep,
  territoryIndex
}) => {
  let span, disabled, btn = 'Continue';
  if (victor === 'defender') {
    span = 'Attackers lose!'
  } else if (victor) {
    span = 'Defenders lose!'
  } else if (casualtyCount) {
    const count = casualtyCount - casualties.length;
    const casualtyWord = casualtyCount === 1 ? 'casualty' : 'casualties';
    span = `mark ${count} ${casualtyWord}`
    disabled = casualties.length < casualtyCount
    btn = 'Remove Casualties'
  } else {
    span = 'Everybody missed!'
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

import React from 'react'

const BattleStatus = ({ 
  attackDefeated,
  defendersLose,
  casualtyCount, 
  casualties, 
  removeCasualties 
}) => {
  let span, disabled, btn = 'Continue';
  if (attackDefeated) {
    span = 'Attackers lose!'
  } else if (defendersLose) {
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
        onClick={removeCasualties} 
        disabled={disabled}>{btn}
      </button>
    </nav>
  )
}

export default BattleStatus

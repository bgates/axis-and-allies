import React from 'react'

const BattleStatus = ({ 
  victor,
  dogfight,
  casualtyCount, 
  defenderCasualtiesCount,
  airCasualties,
  casualties, 
  nextStep,
  territoryIndex
}) => {
  let disabled, span = '', btn = 'Continue'
  const { all, air } = casualtyCount
  if (!all && !defenderCasualtiesCount) {
    span = 'Everybody missed!'
  } else {
    if (victor === 'defender') {
      span = 'Attackers lose!'
    } else if (victor) {
      span = 'Defenders lose! '
    } 
    if (victor !== 'defender') {
      const count = all - casualties.length
      const casualtyWord = count === 1 ? 'casualty' : 'casualties'
      if (count) {
        span += `Mark ${count} ${casualtyWord}.`
        if (air) {
          span += ` At least ${air} must be air units due to antiaircraft hits.`
        }
      } else {
        span += 'Click `Remove Casualties`.'
      }
      disabled = casualties.length < all || airCasualties < air
      btn = 'Remove Casualties'
    }
  }
  return (
    <nav>
      <span>{span}</span>
      <button 
        onClick={(e) => { nextStep(victor, territoryIndex, dogfight) }} 
        disabled={disabled}>{btn}
      </button>
    </nav>
  )
}

export default BattleStatus

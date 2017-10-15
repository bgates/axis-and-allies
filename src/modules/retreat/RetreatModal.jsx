import React from 'react'

const RetreatModal = ({ territory, retreatOptions, retreat, returnToCombat }) => {
  return (
    <div>
      <h1>Retreat Options from {territory.name}</h1>
      <p>You may retreat all your units to one adjacent friendly territory or sea zone by pressing a button below. You can retreat only to a territory or sea zone from which one of your attacking units came. You will not be able to reassign retreated units to other embattled territories this turn, nor make non-combat moves with them later this turn.</p>
      <ul>
        {retreatOptions.map(option => (
         <li key={option.index}><button onClick={retreat.bind(null, option.index)}>{option.name}</button></li>)
        )}
      </ul>
      
      <nav>
        <button onClick={returnToCombat.bind(null, territory)}>Back</button>
      </nav>
    </div>
  )
}

export default RetreatModal

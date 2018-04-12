import React from 'react'
import Dice from '../../../components/Dice'

const CombatRollsModal = ({ rolls, strengths, selectCasualties }) => {

  const { attackers, defenders } = rolls
  return (
    <div className="battleBoard">
      <h1>Combat Results</h1>
      <h2>Defender</h2>
      <div className="defenderSpace"> 
      {strengths.map(n => {
        return (
          <Dice 
            key={n}
            rolls={defenders[n]}
            goalFunction={value => value <= n} />
        )
      })}
    </div>
    <div className="midSpace">
      {strengths.map(n => {
        return <div key={n}>{n}{n > 1 ? <span>or less</span> : ''}</div>
      })}                       
    </div>
    <div className="attackerSpace"> 
      {strengths.map(n => {
        return (
          <Dice 
            key={n}
            rolls={attackers[n]}
            goalFunction={value => value <= n} />
        )
      })}
    </div>
    <h2>Attacker</h2>
    <nav className="forwardOnly">
      <button onClick={selectCasualties}>Select Casualties</button>
    </nav>
  </div>
  )
}

export default CombatRollsModal


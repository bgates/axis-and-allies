import React from 'react'
import DiceResultsModal from '../../../components/DiceResultsModal'

class RocketResultsModal extends DiceResultsModal {

  text (rolls, damages) {
    if (Object.keys(damages).length === 1) {
      const [damage, power] = [Object.values(damages)[0], Object.keys(damages)[0]]
      return <p>You rolled {rolls.join(', ')}, causing {damage} I.P.C. damage to {power}.</p> 
    } else {
      return <div>
        <p>You rolled {rolls.join(', ')}, causing the following damage:</p>
        <table>
          <tr><th>Power</th><th>Damage</th></tr>
          {Object.keys(damages).map(power => (
            <tr><td>{power}</td><td>{damages[power]}</td></tr>
          ))}
        </table>
      </div>
    }
  }

  render () {
    const { damages, rolls, advancePhase } = this.props
    return (
      <DiceResultsModal 
        title={'Rockets'}
        rolls={rolls}
        goalFunction={value => value} >
        <div>
          {this.text(rolls, damages)}
          <nav className="forwardOnly">
            <button onClick={e => advancePhase(damages)}>Purchase Units</button>
          </nav>
        </div>
      </DiceResultsModal>
    )
  }
}

export default RocketResultsModal

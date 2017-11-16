import React from 'react'
import DiceResultsModal from '../../components/DiceResultsModal'

class RocketResultsModal extends DiceResultsModal {

  render () {
    const { damages, rolls, advancePhase } = this.props
    return (
      <DiceResultsModal 
        title={'Rockets'}
        rolls={rolls}
        goalFunction={value => value} >
        <div>
          <p>You rolled {rolls.join(', ')}, causing a total of x IPC damage.</p> 
          <nav className="forwardOnly">
            <button>Purchase Units</button>
          </nav>
        </div>
      </DiceResultsModal>
    )
  }
}

export default RocketResultsModal

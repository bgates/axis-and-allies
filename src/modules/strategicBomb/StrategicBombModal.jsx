import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getFocusTerritory } from '../../selectors/mergeBoardAndTerritories'
import DiceResultsModal from '../../components/DiceResultsModal'
import { strategicBomb, STRATEGIC_BOMB } from '../../actions'

const mapStateToProps = (state) => {
  return {
    territory: getFocusTerritory(state),
    rolls: state.rolls[STRATEGIC_BOMB]
  }
}

const advancePhase = (territory) => strategicBomb(territory) 

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ advancePhase }, dispatch)
}

class StrategicBombComponent extends DiceResultsModal {

  render () {
    const { rolls, territory, advancePhase } = this.props
    const total = rolls.reduce((total, n) => total + n);
    const actual = Math.min(total, territory.ipc_value)
    return (
      <DiceResultsModal 
        title={'Strategic Bombing'}
        rolls={rolls}
        goalFunction={value => value}>
        <div>
          <p>You rolled {rolls.join(', ')}, costing your enemy a total of {actual} I.P.C.s.</p> 
          <nav className="forwardOnly">
            <button onClick={() => advancePhase(territory)}>
              Continue
            </button>
          </nav>
        </div>
      </DiceResultsModal>
    )
  }
}

const StrategicBombModal = connect(mapStateToProps, mapDispatchToProps)(StrategicBombComponent)

export default StrategicBombModal

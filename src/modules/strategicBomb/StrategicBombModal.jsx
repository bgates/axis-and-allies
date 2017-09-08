import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { continueOrAdvancePhase } from '../selectCasualties'
import { getFocusTerritory } from '../../selectors/mergeBoardAndTerritories'
import DiceResultsModal from '../../components/DiceResultsModal'
import { viewStrategicBombingResults } from '../../actions'
import PATHS from '../../paths'

const mapStateToProps = (state) => {
  return {
    territory: getFocusTerritory(state),
    rolls: state.rolls[PATHS.STRATEGIC_BOMB]
  }
}

const advancePhase = (damage, power, territoryIndex) => {
  return (dispatch, getState) => {
    dispatch(viewStrategicBombingResults(damage, power, territoryIndex))
    continueOrAdvancePhase(dispatch, getState())
  }
}


const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ advancePhase }, dispatch)
}

class StrategicBombComponent extends DiceResultsModal {

  render () {
    const { rolls, territory, advancePhase } = this.props
    const total = rolls.reduce((total, n) => total + n);
    const damage = Math.min(total, territory.ipc_value)
    return (
      <DiceResultsModal 
        title={'Strategic Bombing'}
        rolls={rolls}
        goalFunction={value => value}>
        <div>
          <p>You rolled {rolls.join(', ')}, costing your enemy a total of {damage} I.P.C.s.</p> 
          <nav className="forwardOnly">
            <button onClick={() => advancePhase(damage, territory.currentPower, territory.index)}>
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

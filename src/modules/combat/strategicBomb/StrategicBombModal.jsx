import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { strategicBombing } from '../../planCombat'
import { getFocusTerritory } from '../../../selectors/getTerritory'
import DiceResultsModal from '../../../components/DiceResultsModal'
import { viewStrategicBombingResults } from '../../../actions'
import PATHS from '../../../paths'

const mapStateToProps = (state) => {
  return {
    territory: getFocusTerritory(state),
    rolls: state.rolls[PATHS.STRATEGIC_BOMB]
  }
}

const advancePhase = (damage, power, territoryIndex) => {
  return (dispatch, getState) => {
    const unitIds = strategicBombing(getState())
    dispatch(viewStrategicBombingResults(damage, power, territoryIndex, unitIds))
    dispatch(push(PATHS.COMBAT))
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

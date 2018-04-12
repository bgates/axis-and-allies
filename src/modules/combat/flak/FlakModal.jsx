import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { continueOrAdvancePhase } from '../selectCasualties'
import { strategicBombing } from '../../planCombat'
import { getFocusTerritory } from '../../../selectors/getTerritory'
import DiceResultsModal from '../../../components/DiceResultsModal'
import { removeFlakCasualties } from '../../../actions'
import PATHS from '../../../paths'

const mapStateToProps = (state) => {
  return {
    territory: getFocusTerritory(state),
    rolls: state.rolls[PATHS.FLAK]
  }
}

const advancePhase = (rolls, territoryIndex) => {
  return (dispatch, getState) => {
    const casualties = strategicBombing(getState()).filter((_, n) => rolls[n] === 1)
    dispatch(removeFlakCasualties(casualties, territoryIndex))
    continueOrAdvancePhase(dispatch, getState())
  }
}
// from flak, where to go?
// dogfight if possible
// strat if possible
// resolve combat if possible
// next phase otherwise
//
class FlakComponent extends DiceResultsModal {

  render () {
    const { rolls, territory, advancePhase } = this.props
    const total = rolls.filter(n => n === 1).length
    return (
      <DiceResultsModal 
        title={'Flak Defenses'}
        rolls={rolls}
        goalFunction={value => value === 1}>
        <div>
          <p>The enemy rolled {rolls.join(', ')}, hitting a total of {total} of your aircraft.</p> 
          <nav className="forwardOnly">
            <button onClick={() => advancePhase(rolls, territory.index)}>
              Continue
            </button>
          </nav>
        </div>
      </DiceResultsModal>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ 
    advancePhase
  }, dispatch)
}

const FlakModal = connect(mapStateToProps, mapDispatchToProps)(FlakComponent)

export default FlakModal


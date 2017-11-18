import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import PATHS from '../../paths'
import RetreatModal from './RetreatModal'
import { attackerCasualties, defenderCasualties } from '../combat'
import { continueOrAdvancePhase } from '../selectCasualties'
import { getInboundUnits } from '../../selectors/getTerritory'
import { getCurrentPowerName } from '../../selectors/getCurrentPower'
import { removeCasualties, resolveCombat, RETREAT } from '../../actions'
import { getFocusTerritory, retreatOptions } from './selectors'

const mapStateToProps = (state) => ({
  territory: getFocusTerritory(state),
  retreatOptions: retreatOptions(state),
})

const retreat = (battleTerritoryIndex, retreatTerritoryIndex) => (
  (dispatch, getState) => {
    let state = getState()
    dispatch(removeCasualties(defenderCasualties(state), attackerCasualties(state), battleTerritoryIndex, getCurrentPowerName(state)))
    state = getState()
    const survivors = getInboundUnits(state, battleTerritoryIndex)
    dispatch({ type: RETREAT, battleTerritoryIndex, retreatTerritoryIndex, survivors })
    state = getState()
    continueOrAdvancePhase(dispatch, state)
  }
)

const returnToCombat = (territoryIndex) => {
  return dispatch => {
    dispatch(push(PATHS.RESOLVE_COMBAT))
    dispatch(resolveCombat(territoryIndex))
  }
}
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ 
    returnToCombat,
    retreat
  }, dispatch)
}

const RetreatContainer = connect(mapStateToProps, mapDispatchToProps)(RetreatModal)

export default RetreatContainer


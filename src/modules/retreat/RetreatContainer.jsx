import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import PATHS from '../../paths'
import RetreatModal from './RetreatModal'
import { defenderCasualties } from '../combatRolls'
import { getFocusTerritory } from '../../selectors/mergeBoardAndTerritories'
import { getCurrentPower } from '../../selectors/getCurrentPower'
import { removeCasualties, resolveCombat, RETREAT } from '../../actions'
import { retreatOptions } from './selectors'

const mapStateToProps = (state) => ({
  territory: getFocusTerritory(state),
  retreatOptions: retreatOptions(state),
})

const retreat = (battleTerritoryIndex, retreatTerritoryIndex) => (
  (dispatch, getState) => {
    const state = getState()
    dispatch(removeCasualties(defenderCasualties(state), battleTerritoryIndex, getCurrentPower(state).name))
    dispatch({ type: RETREAT, battleTerritoryIndex, retreatTerritoryIndex })
    dispatch(push(PATHS.RESOLVE_COMBAT))
  }
)

const returnToCombat = (territory) => {
  return dispatch => {
    dispatch(push(PATHS.RESOLVE_COMBAT))
    dispatch(resolveCombat(territory))
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


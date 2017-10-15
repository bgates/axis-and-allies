import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import PATHS from '../../paths'
import RetreatModal from './RetreatModal'
import { getFocusTerritory } from '../../selectors/mergeBoardAndTerritories'
import { resolveCombat, RETREAT } from '../../actions'
import { retreatOptions } from './selectors'

const mapStateToProps = (state) => ({
  territory: getFocusTerritory(state),
  retreatOptions: retreatOptions(state),
})

const retreat = (territoryIndex) => (
  { type: RETREAT, territoryIndex }
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


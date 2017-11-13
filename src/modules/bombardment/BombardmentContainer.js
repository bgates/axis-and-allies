import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Bombardment from './Bombardment'
import { getFocusTerritory } from '../../selectors/getTerritory'
import { getBombardmentCapableUnits } from './selectors'
import { 
  COMMIT_BOMBARDMENT_UNITS, 
  UNCOMMIT_BOMBARDMENT_UNITS,
  resolveCombat
} from '../../actions'

const mapStateToProps = (state) => ({
  territory: getFocusTerritory(state),
  bombardmentCapableUnits: getBombardmentCapableUnits(state)
})

const commitBombardmentUnits = (unitId, locationIndex, targetIndex) => (
  {
    type: COMMIT_BOMBARDMENT_UNITS,
    unitId,
    locationIndex,
    targetIndex
  }
)

const uncommitBombardmentUnits = (unitId, locationIndex, targetIndex) => (
  {
    type: UNCOMMIT_BOMBARDMENT_UNITS,
    unitId,
    locationIndex,
    targetIndex
  }
)

const mapDispatchToProps = (dispatch) => (
  bindActionCreators({ 
    commitBombardmentUnits,
    uncommitBombardmentUnits,
    resolveCombat
  }, dispatch)
)

const BombardmentContainer = connect(mapStateToProps, mapDispatchToProps)(Bombardment)

export default BombardmentContainer

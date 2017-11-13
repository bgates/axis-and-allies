import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Bombardment from './Bombardment'
import { getFocusTerritory } from '../../selectors/getTerritory'
import { getBombardmentCapableUnits, getBombardingIds } from './selectors'
import { 
  COMMIT_BOMBARDMENT_UNITS, 
  UNCOMMIT_BOMBARDMENT_UNITS,
  resolveCombat
} from '../../actions'

const mapStateToProps = (state) => ({
  committed: getBombardingIds(state),
  territory: getFocusTerritory(state),
  bombardmentCapableUnits: getBombardmentCapableUnits(state)
})

const commitBombardmentUnits = (locationIndex, targetIndex, unitIds) => (
  {
    type: COMMIT_BOMBARDMENT_UNITS,
    locationIndex,
    targetIndex,
    unitIds
  }
)

const uncommitBombardmentUnits = (targetIndex, unitIds) => (
  {
    type: UNCOMMIT_BOMBARDMENT_UNITS,
    targetIndex,
    unitIds
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

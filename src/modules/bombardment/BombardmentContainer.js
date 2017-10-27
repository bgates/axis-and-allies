import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Bombardment from './Bombardment'
import { getFocusTerritory, getBombardmentCapableUnits } from './selectors'
import { 
  COMMIT_BOMBARDMENT_UNITS, 
  UNCOMMIT_BOMBARDMENT_UNITS,
  resolveCombat
} from '../../actions'

const mapStateToProps = (state) => ({
  territory: getFocusTerritory(state),
  bombardmentCapableUnits: getBombardmentCapableUnits(state)
})

const commitBombardmentUnits = (unit, locationIndex, targetIndex, ids) => {
  return {
    type: COMMIT_BOMBARDMENT_UNITS,
    unit,
    locationIndex,
    targetIndex,
    ids
  }
}

const uncommitBombardmentUnits = (unit, locationIndex, targetIndex, ids) => {
  return {
    type: UNCOMMIT_BOMBARDMENT_UNITS,
    unit,
    locationIndex,
    targetIndex,
    ids
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ 
    commitBombardmentUnits,
    uncommitBombardmentUnits,
    resolveCombat
  }, dispatch)
}

const BombardmentContainer = connect(mapStateToProps, mapDispatchToProps)(Bombardment)

export default BombardmentContainer

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import PlacementModal from './PlacementModal';
import { industrialComplexes, shipyards, purchases } from './selectors';
import { getCurrentPower } from '../../selectors/getCurrentPower';

const mapStateToProps = (state) => {
  return {
    currentPower: getCurrentPower(state),
    industrialComplexes: industrialComplexes(state),
    shipyards: shipyards(state),
    purchases: purchases(state)
  }
}

const commitUnitPlacement = (unit, territory) => {

}

const unCommitUnitPlacement = (unit, territory) => {

}

const mapDispatchToProps = (dispatch) => {
  return {
    commitUnitPlacement: bindActionCreators(() => {}, dispatch)
  }
}

const PlacementContainer = connect(mapStateToProps, mapDispatchToProps)(PlacementModal)

export default PlacementContainer


import { connect } from 'react-redux'
import Powers from './Powers'
import { getCurrentPower, nplByPower } from './selectors'

const mapStateToProps = (state) => {
  return {
    powers: state.powers,
    currentPower: getCurrentPower(state),   
    npl: nplByPower(state)
  }
}

const PowersContainer = connect(mapStateToProps)(Powers)

export default PowersContainer


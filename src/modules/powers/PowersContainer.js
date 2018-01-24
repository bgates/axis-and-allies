// @flow
import { connect } from 'react-redux'
import Powers from './Powers'
import { getPowers, getCurrentPower, nplByPower } from './selectors'

const mapStateToProps = (state) => {
  return {
    powers: getPowers(state),
    currentPower: getCurrentPower(state),   
    npl: nplByPower(state)
  }
}

const PowersContainer = connect(mapStateToProps)(Powers)

export default PowersContainer


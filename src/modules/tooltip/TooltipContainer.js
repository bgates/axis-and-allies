import { connect } from 'react-redux'
import Tooltip from './Tooltip'
import { getCurrentPowerName } from '../../selectors/getCurrentPower'
import { getUnits, getIndustry, getTerritoryName } from './selectors'

const mapStateToProps = (state, { territoryIndex, playing }) => ({
  currentPower: getCurrentPowerName(state),
  playing,
  units: getUnits(state, territoryIndex),
  industry: getIndustry(state, territoryIndex),
  territoryName: getTerritoryName(state, territoryIndex)
})

const TooltipContainer = connect(mapStateToProps)(Tooltip)

export default TooltipContainer

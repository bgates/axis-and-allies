// @flow
import { connect } from 'react-redux'
import Tooltip from './Tooltip'
import { 
  getCurrentPowerName,
  getUnits, 
  getIndustry, 
  getSide,
  getTerritoryName,
  getTerritoryValue
} from './selectors'

const mapStateToProps = (state, { territoryIndex, playing }) => ({
  currentPower: getCurrentPowerName(state),
  playing,
  side: getSide(state),
  units: getUnits(state, territoryIndex),
  industry: getIndustry(state, territoryIndex),
  territoryName: getTerritoryName(state, territoryIndex),
  territoryValue: getTerritoryValue(state, territoryIndex),
  index: territoryIndex
})

const TooltipContainer = connect(mapStateToProps)(Tooltip)

export default TooltipContainer

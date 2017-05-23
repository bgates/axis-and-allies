import React, { Component } from 'react'
import Territory from './Territory'
import Tooltip from './Tooltip'
import ConvoyImages from './ConvoyImages'
import FireImage from './FireImage'
import Modal from './Modal'
import AdvanceButton from './AdvanceButton'
import '../../assets/styles/game.css'
import '../../assets/styles/color.css'

class Territories extends Component {
  constructor () {
    super()
    this.state = {
      tooltipTerritory: {units: []},
      ctrlPressed: false
    }
    this.handleKeydown = this.handleKeydown.bind(this)
    this.handleKeyup = this.handleKeyup.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.handleMouseOut = this.handleMouseOut.bind(this)
    this.setVisibility = this.setVisibility.bind(this)
  }

  componentDidMount () {
    document.addEventListener('keydown', this.handleKeydown)
    document.addEventListener('keyup', this.handleKeyup)
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.handleKeydown)
    document.removeEventListener('keyup', this.handleKeyup)
  }

  handleKeydown (event) {
    if (event.key === 'Control') {
      this.setState({ ctrlPressed: true })
    }
  }

  handleKeyup (event) {
    if (event.key === 'Control') {
      this.setState({ ctrlPressed: false })
    }
  }

  conditionalTooltip () {
    if ((this.props.hasOverlay && this.state.ctrlPressed) ||
        !this.props.hasOverlay) {
      return (
        <div
          id='tooltip'
          ref={ (component) => this.tooltip = component }>
          <Tooltip
            territory={this.state.tooltipTerritory}
            currentPower={this.props.currentPower} />
        </div>
      )
    }
    return null
  }

  setVisibility (territory) {
    if (this.tooltip) {
      let { tooltipTerritory } = this.state
      let display
      if (territory) {
        display = 'block'
        tooltipTerritory = territory
      } else {
        display = 'none'
      }
      this.tooltip.style.display = display
      this.setState({ tooltipTerritory })
    }
  }

  handleMouseOut (event) {
    if (event.relatedTarget &&
        !['path', 'svg'].includes(event.relatedTarget.tagName)) {
      this.setVisibility(false)
    }
  }

  tooltipLeft (mousePosition, tooltipWidth) {
    const verticalCenter = 600 + tooltipWidth 
    if (mousePosition <= 10) {
      return 10
    } else if (mousePosition <= verticalCenter) {
      return mousePosition * (600 / verticalCenter)
    } else {
      return mousePosition - tooltipWidth 
    }
  }

  handleMouseMove (event) {
    if (this.tooltip) {
      const { width, height } = this.tooltip.getBoundingClientRect()
      const left = this.tooltipLeft(event.clientX, width)
      this.tooltip.style.left = left + 'px'

      const yPos = event.clientY
      const yAdjustment = yPos > 550 ? height + 75 : 45
      const top = yPos - yAdjustment + 'px'
      this.tooltip.style.top = top
    }
  }

  render () {
    return (
      <div id='container' onMouseOut={this.handleMouseOut}>
        {this.conditionalTooltip()}
        <svg
          preserveAspectRatio='xMinYMin meet'
          viewBox='0 0 3375 1602'
          onMouseMove={this.handleMouseMove}>
          <ConvoyImages/>
          <FireImage />
          {this.props.board.map((territory, index) =>
            <Territory territory={territory}
              setVisibility={this.setVisibility.bind(this, territory)}
              handleClick={this.props.territoryClick.bind(null, territory)}
              key={index} />
           )}
        </svg>
        {this.props.hasOverlay && <Modal ctrlPressed={this.state.ctrlPressed} phase={this.props.phase.current}/>}
        {this.props.advanceBtn && <AdvanceButton />}
      </div>
    )
  }
}
export default Territories

import React, { Component } from 'react'
import TerritoryContainer from '../../territory/TerritoryContainer'
import { TooltipContainer } from '../../tooltip'
import ConvoyImages from './ConvoyImages'
import FireImage from './FireImage'
import Modal from './Modal'
import AdvanceButton from './AdvanceButton'
import '../../../assets/styles/game.css'
import '../../../assets/styles/color.css'

class Territories extends Component {
  constructor (props) {
    super(props)
    this.state = {
      tooltipTerritoryIndex: 0,
      ctrlPressed: false
    }
    this.handleKeydown = this.handleKeydown.bind(this)
    this.handleKeyup = this.handleKeyup.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.handleMouseOut = this.handleMouseOut.bind(this)
    this.setVisibility = this.setVisibility.bind(this)
    this.setVisibilities = props.territories.reduce((obj, _, index) => {
      obj[index] = this.setVisibility.bind(this, index)
      return obj
    }, {})
  }

  componentDidMount () {
    document.addEventListener('keydown', this.handleKeydown)
    document.addEventListener('keyup', this.handleKeyup)
    this.verticalCenter = 0.5 * this.box.clientWidth 
    this.horizontalCenter = this.box.offsetTop + this.box.clientHeight * 0.57 
    this.heightNormalizer = 20 / (this.box.clientHeight - this.horizontalCenter)
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
          <TooltipContainer
            territoryIndex={this.state.tooltipTerritoryIndex}
            playing={this.props.playing} />
        </div>
      )
    }
    return null
  }

  setVisibility (territoryIndex) {
    if (this.tooltip) {
      let { tooltipTerritoryIndex } = this.state
      let display
      if (territoryIndex) {
        display = 'block'
        tooltipTerritoryIndex = territoryIndex
      } else {
        display = 'none'
      }
      this.tooltip.style.display = display
      this.setState({ tooltipTerritoryIndex })
    }
  }

  handleMouseOut (event) {
    if (event.relatedTarget &&
        !['path', 'svg'].includes(event.relatedTarget.tagName)) {
      this.setVisibility(false)
    }
  }

  tooltipLeft (mousePosition, tooltipWidth) {
    const verticalCenter = this.verticalCenter + tooltipWidth 
    if (mousePosition <= 10) {
      return 10
    } else if (mousePosition <= verticalCenter) {
      return mousePosition * (this.verticalCenter / verticalCenter)
    } else {
      return mousePosition - tooltipWidth 
    }
  }

  tooltipTop (mousePosition, tooltipHeight) {
    let adjustment = this.box.offsetTop
    if (mousePosition > this.horizontalCenter) {
      adjustment += tooltipHeight + this.heightNormalizer * (mousePosition - this.horizontalCenter)  
    } else {
      adjustment -= 10 + this.heightNormalizer * (this.box.offsetTop + this.horizontalCenter - mousePosition) 
    }
    return mousePosition - adjustment 
  }

  handleMouseMove (event) {
    if (this.tooltip) {
      const { width, height } = this.tooltip.getBoundingClientRect()
      const left = this.tooltipLeft(event.clientX, width)
      this.tooltip.style.left = left + 'px'

      const top = this.tooltipTop(event.clientY, height)
      this.tooltip.style.top = top + 'px'
    }
  }

  render () {
    return (
      <div 
        id='container' 
        onMouseOut={this.handleMouseOut} 
        ref={element => this.box = element} >
        {this.conditionalTooltip()}
        <svg
          preserveAspectRatio='xMinYMin meet'
          viewBox='0 0 3375 1602'
          onMouseMove={this.handleMouseMove}>
          <ConvoyImages/>
          <FireImage />
          {this.props.territories.map((_, index) =>
            <TerritoryContainer
              playing={this.props.playing}
              territoryIndex={index}
              setVisibility={this.setVisibilities[index]}
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

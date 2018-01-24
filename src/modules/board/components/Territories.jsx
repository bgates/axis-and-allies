// @flow
import React, { Component } from 'react'
import TerritoryContainer from '../../territory/TerritoryContainer'
import { TooltipContainer } from '../../tooltip'
import ConvoyImages from './ConvoyImages'
import FireImage from './FireImage'
import Modal from './Modal'
import AdvanceButton from './AdvanceButton'
import '../../../assets/styles/game.css'
import '../../../assets/styles/color.css'

type Props = {
  advanceBtn: boolean,
  hasOverlay: boolean,
  playing: boolean,
  phase: { current: string },
  territories: Array<Object>
}
type State = {
  tooltipTerritoryIndex: number,
  ctrlPressed: boolean
}
class Territories extends Component<Props, State> {
  box: ?HTMLDivElement
  horizontalCenter: number
  heightNormalizer: number
  tooltip: ?HTMLDivElement
  setVisibilities: { [string]: (n:number) => void }
  verticalCenter:number
  constructor (props:Props) {
    super(props)
    this.state = {
      tooltipTerritoryIndex: 0,
      ctrlPressed: false
    }
    this.setVisibilities = props.territories.reduce((obj, _, index) => {
      obj[index] = this.setVisibility.bind(this, index)
      return obj
    }, {})
  }

  componentDidMount () {
    document.addEventListener('keydown', this.handleKeydown)
    document.addEventListener('keyup', this.handleKeyup)
    this.verticalCenter = this.box ? 0.5 * this.box.clientWidth : 0
    this.horizontalCenter = this.box ? this.box.offsetTop + this.box.clientHeight * 0.57 : 0
    this.heightNormalizer = this.box ? 20 / (this.box.clientHeight - this.horizontalCenter) : 0
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.handleKeydown)
    document.removeEventListener('keyup', this.handleKeyup)
  }

  handleKeydown = (event:Event) => {
    if (event.key === 'Control') {
      this.setState({ ctrlPressed: true })
    }
  }

  handleKeyup = (event:Event) => {
    if (event.key === 'Control') {
      this.setState({ ctrlPressed: false })
    }
  }

  conditionalTooltip = () => {
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

  setVisibility = (territoryIndex:number | boolean) => {
    if (this.tooltip) {
      const tooltip = this.tooltip
      let display
      if (territoryIndex) {
        display = 'block'
        const tooltipTerritoryIndex = parseInt(territoryIndex)
        this.setState({ tooltipTerritoryIndex })
      } else {
        display = 'none'
      }
      tooltip.style.display = display
    }
  }

  handleMouseOut = (event:Event & { relatedTarget: Element }) => {
    if (event.relatedTarget &&
        !['path', 'svg'].includes(event.relatedTarget.tagName)) {
      this.setVisibility(false)
    }
  }

  tooltipLeft = (mousePosition: number, tooltipWidth: number) => {
    const verticalCenter = this.verticalCenter + tooltipWidth 
    if (mousePosition <= 10) {
      return 10
    } else if (mousePosition <= verticalCenter) {
      return mousePosition * (this.verticalCenter / verticalCenter)
    } else {
      return mousePosition - tooltipWidth 
    }
  }

  tooltipTop = (mousePosition: number, tooltipHeight: number) => {
    if (this.box) {
      let adjustment = this.box.offsetTop
      if (mousePosition > this.horizontalCenter) {
        adjustment += tooltipHeight + this.heightNormalizer * (mousePosition - this.horizontalCenter)  
      } else {
        adjustment -= 10 + this.heightNormalizer * (this.box.offsetTop + this.horizontalCenter - mousePosition) 
      }
      return mousePosition - adjustment 
    }
    return 0
  }

  handleMouseMove = (event:SyntheticMouseEvent<HTMLElement>) => {
    if (this.tooltip) {
      const tooltip = this.tooltip //https://github.com/facebook/flow/issues/4865
      const { width, height } = this.tooltip.getBoundingClientRect()
      const left = this.tooltipLeft(event.clientX, width)
      tooltip.style.left = left + 'px'

      const top = this.tooltipTop(event.clientY, height)
      tooltip.style.top = top + 'px'
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
              setVisibility={this.setVisibilities[index.toString()]}
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

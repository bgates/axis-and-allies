// @flow
import * as React from 'react'
type Props = {
  children: React.Node,
  index: number,
  handleClick: (n:number) => void
}
class BoundButton extends React.Component<Props> {
  _onClick = () => {
    this.props.handleClick(this.props.index)
  }
  render () {
    return <button onClick={this._onClick}>{this.props.children}</button>
  }
}

export default BoundButton

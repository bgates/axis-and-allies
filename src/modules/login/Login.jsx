import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'

class Login extends Component {

  constructor (props) {
    super(props)
    this.state = { isLoading: false, error: null }
  }

  handleLogin (event) {
    this.setState({ isLoading: true })
    event.preventDefault()
    const { email, password } = this
    this.props.login(email.value, password.value)
      .then(() => this.setState({ isLoading: false }))
      .catch(e => this.setState({ error: e.message, isLoading: false }))
  }

  render () {
    return (
      <div>
        <a data-tip className="help">?</a>
        <h1>Login</h1>
        <ReactTooltip place="bottom">
          <p><strong>Login to your account.</strong> If you are already playing a single game in progress, you will automatically join that game. If you are playing multiple games, you will be given the option of choosing which one to join. If you are not part of a current game, you will be taken to a dialog to let you create one.</p>
        </ReactTooltip>
        <h3>Loading: {this.state.isLoading ? 'True' : 'False'}</h3>
        {this.state.error && <h2>{this.state.error}</h2>}
        <form onSubmit={this.handleLogin.bind(this)}>
          <input 
            name="email" 
            placeholder="Email" 
            ref={node => this.email = node} />
          <input 
            name="password" 
            placeholder="Password" 
            ref={node => this.password = node} />
          <button>Login</button>
        </form>
        <nav>
          <Link to={'/create-game'} className="btn">Create a Game</Link>
        </nav>
      </div>
    )
  }
}

export default Login


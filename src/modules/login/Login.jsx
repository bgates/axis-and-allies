import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { isEmpty } from 'react-redux-firebase'
import ReactTooltip from 'react-tooltip'

class Login extends Component {

  constructor (props) {
    super(props)
    this.state = { isLoading: false, error: null }
    this.handleLogin = this.handleLogin.bind(this)
    this.handleSignup = this.handleSignup.bind(this)
  }

  loginOrSignup (method) {
    this.setState({ isLoading: true })
    const { email, password } = this
    this.props[method](email.value, password.value)
      .then(() => this.setState({ isLoading: false }))
      .catch(e => this.setState({ error: e.message, isLoading: false }))

  }

  handleLogin () {
    this.loginOrSignup('login')
  }

  handleSignup () {
    this.loginOrSignup('signup') 
  }

  render () {
    if (isEmpty(this.props.auth)) {
      return (
        <div className="login">
          <h1>Login / Signup</h1>
          <a data-tip className="help">?</a>
          <ReactTooltip place="bottom">
            <p><strong>Login to your account.</strong> If you are already playing a single game in progress, you will automatically join that game. If you are playing multiple games, you will be given the option of choosing which one to join. If you are not part of a current game, you will be taken to a dialog to let you create one.</p>
          </ReactTooltip>
          {this.state.error && <h2>{this.state.error}</h2>}
          <input 
            name="email" 
            placeholder="Email" 
            ref={node => this.email = node} />
          <input 
            name="password" 
            placeholder="Password" 
            ref={node => this.password = node} />
          <button onClick={this.handleLogin}>Login</button>
          <button onClick={this.handleSignup}>Signup</button>
        </div>
      )
    } else {
      return (
        <div className="login">
          <nav>
            <button onClick={this.props.logout}>Logout</button>
            <Link to={'/create-game'} className="btn">Create a Game</Link>
          </nav>
        </div>
      )
    }
  }
}

export default Login


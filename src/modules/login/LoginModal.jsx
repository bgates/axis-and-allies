import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'

class LoginModal extends Component {

  handleLogin (event) {
    event.preventDefault()
    const { email, password } = this
    console.log(email.value, password.value)
    this.props.login(email.value, password.value)
  }

  render () {
    return (
      <div>
        <a data-tip className="help">?</a>
        <h1>Login</h1>
        <ReactTooltip place="bottom">
          <p><strong>Login to your account.</strong> If you are already playing a single game in progress, you will automatically join that game. If you are playing multiple games, you will be given the option of choosing which one to join. If you are not part of a current game, you will be taken to a dialog to let you create one.</p>
        </ReactTooltip>
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
          <Link to={'/'} className="btn">Close</Link>
          <Link to={'/signup'} className="btn">Sign Up</Link>
        </nav>
      </div>
    )
  }
}

export default LoginModal


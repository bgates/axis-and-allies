import React, { Component } from 'react'
import '../../assets/styles/login.css'

class CreateGame extends Component {

  constructor (props) {
    super(props)
    this.state = { select: '' }
    this.setSelect = this.setSelect.bind(this)
    this.createGame = this.createGame.bind(this)
  }

  createGame (event) {
    event.preventDefault()
    const data = new FormData(event.target)
    this.props.createGame(data)
  }

  setSelect (event) {
    this.setState({ select: event.target.value })
  }

  showSelect () {
    if (!this.props.auth.uid) {
      return (
        <select onChange={this.setSelect}>
          <option>Who are you playing?</option>
          <option value="germany">Germany</option>
          <option value="ussr">USSR</option>
          <option value="japan">Japan</option>
          <option value="uk">United Kingdom</option>
          <option value="italy">Italy</option>
          <option value="china">China</option>
          <option value="us">USA</option>
        </select>
      )
    }
  }

  render () {
    return (
      <div className="create-game">
        <h1>Create Game</h1>
        <p>Enter the email addresses and screen names for everyone who wants to play the game. You can enter an email address more than once if you are playing with fewer than seven people.</p>
        <p>If you are already playing a single game in progress, you will automatically join that game. If you are playing multiple games, you will be given the option of choosing which one to join. If you are not part of a current game, you will be taken to a dialog to let you create one.</p>
        <form onSubmit={this.createGame}>
          <div>
            <label>Germany</label>
            <input name="email_germany" placeholder="Email for German player"/>
            <input name="screenname_germany" placeholder="German screen name" />
          </div>
          <div>
            <label>USSR</label>
            <input name="email_ussr" placeholder="Email for Soviet player"/>
            <input name="screenname_ussr" placeholder="Soviet screen name"/>
          </div>
          <div>
            <label>Japan</label>
            <input name="email_japan" placeholder="Email for Japanese player"/>
            <input name="screenname_japan" placeholder="Japanese screen name"/>
          </div>
          <div>
            <label>UK</label>
            <input name="email_uk" placeholder="Email for British player"/>
            <input name="screenname_uk" placeholder="British screen name"/>
          </div>
          <div>
            <label>Italy</label>
            <input name="email_italy" placeholder="Email for Italian player"/>
            <input name="screenname_italy" placeholder="Italian screen name" />
          </div>
          <div>
            <label>China</label>
            <input name="email_china" placeholder="Email for Chinese player"/>
            <input name="screenname_china" placeholder="Chinese screen name"/>
          </div>
          <div>
            <label>USA</label>
            <input name="email_us" placeholder="Email for American player"/>
            <input name="screenname_us" placeholder="American screen name"/>
          </div>
          {this.showSelect()}
          <button disabled={!this.state.select && !this.props.auth.uid}>Create Game</button>
        </form>
      </div>
    )
  }
}

export default CreateGame


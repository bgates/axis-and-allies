import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'

class CreateGame extends Component {

  createGame (event) {
    event.preventDefault()
    const data = new FormData(event.target)
    this.props.createGame(data)
  }

  render () {
    return (
      <div>
        <a data-tip className="help">?</a>
        <h1>Create Game</h1>
        <ReactTooltip place="bottom">
          <p><strong>Login to your account.</strong> If you are already playing a single game in progress, you will automatically join that game. If you are playing multiple games, you will be given the option of choosing which one to join. If you are not part of a current game, you will be taken to a dialog to let you create one.</p>
        </ReactTooltip>
        <form onSubmit={this.createGame.bind(this)}>
          <div>
            <label>Germany</label>
            <input name="email_germany" />
            <input name="screenname_germany" />
          </div>
          <div>
            <label>USSR</label>
            <input name="email_ussr" />
            <input name="screenname_ussr" />
          </div>
          <div>
            <label>Japan</label>
            <input name="email_japan" />
            <input name="screenname_japan" />
          </div>
          <div>
            <label>UK</label>
            <input name="email_uk" />
            <input name="screenname_uk" />
          </div>
          <div>
            <label>Italy</label>
            <input name="email_italy" />
            <input name="screenname_italy" />
          </div>
          <div>
            <label>China</label>
            <input name="email_china" />
            <input name="screenname_china" />
          </div>
          <div>
            <label>USA</label>
            <input name="email_us" />
            <input name="screenname_us" />
          </div>
          <button>Create Game</button>
        </form>
      </div>
    )
  }
}

export default CreateGame


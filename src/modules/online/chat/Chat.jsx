import React, { Component } from 'react'
import { isLoaded, isEmpty } from 'react-redux-firebase'
import { flags } from '../../../config/initialPowers'
import '../../../assets/styles/chat.css'

const Message = ({ author, power, text }) => (
  <li>
    <div className={power.toLowerCase()}>
      <img className="round" src={flags[power.toLowerCase()]} alt={power} />
    </div>{author}: {text}
  </li>
)

class Messages extends Component {

  handleAdd () {
    const { msg } = this
    const { power, firebase, node } = this.props
    firebase.push(node, { text: msg.value, author: power.screenname, power: power.name })
    msg.value = ''
  }

  messageList (messages) {
    if (!isLoaded(messages)) {
      return 'Loading'
    } else if (isEmpty(messages)) {
      return <li>No messages yet</li>
    } else {
      return Object.keys(messages).map(key => <Message key={key} {...messages[key]} />)
    }
  }

  render () {
    const { type, list } = this.props
    return (
      <section>
        <h2>{type} Messages</h2>
        <ul>{this.messageList(list)}</ul>
        <input type="text" ref={node => this.msg = node} />
        <button onClick={() => this.handleAdd()}>Add</button>
      </section>
    )
  }
}

const Chat = ({ firebase, loggedInPower }) => {
  const { profile: { axis, currentGameId }, data: { chat, sideChat } } = firebase
  const side = axis ? 'axisChat' : 'alliesChat'
  return (
    <section className="chat">
      <Messages 
        type="Public" 
        list={chat} 
        firebase={firebase}
        power={loggedInPower}
        node={`/chat/${currentGameId}`} />
      <Messages 
        type="Private" 
        list={sideChat} 
        firebase={firebase}
        power={loggedInPower}
        node={`/${side}/${currentGameId}`} />
    </section>
  )
}

export default Chat

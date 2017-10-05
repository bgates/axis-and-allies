import React, { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase'
import '../../assets/styles/chat.css'

class Messages extends Component {

  handleAdd () {
    const msg = this.msg
    const { power, firebase } = this.props
    firebase.push(this.props.node, { text: msg.value, author: power.screenname, power: power.name })
    msg.value = ''
  }

  messageList (messages) {
    if (!isLoaded(messages)) {
      return 'Loading'
    } else if (isEmpty(messages)) {
      return <li>No messages yet</li>
    } else {
      return Object.keys(messages).map(key => <li key={key}>{messages[key].text}</li>)
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

const Chat = ({ chat, sideChat, firebase, profile, loggedInPower }) => {

  const { axis, currentGameId } = profile
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

const chats = ({ profile: { currentGameId, axis }}) => {
  return [
    { 
      path: `/chat/${currentGameId}`, 
      storeAs: 'chat'
    }, 
    { 
      path: `/${axis ? 'axis' : 'allies'}Chat/${currentGameId}`,
      storeAs: 'sideChat' 
    }
  ]
}

export default compose(
  firebaseConnect(chats),
  connect(
    ({ firebase: { profile, data: {chat, sideChat }}, game: { loggedInPower } }) => ({ 
      chat,
      sideChat,
      loggedInPower,
      profile
    })
  )
)(Chat)

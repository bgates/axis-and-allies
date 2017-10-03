import React, { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase'

class Chat extends Component {

  handleAdd (chat, gameId) {
    const msg = this[chat]
    this.props.firebase.push(`/${chat}/${gameId}`, { text: msg.value })
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
    const { chat, sideChat, profile } = this.props 
    const { axis, currentGameId }= profile
    const side = axis ? 'axisChat' : 'alliesChat'
    return (
      <section id="chat">
        <section id="public">
          <h2>Public Messages</h2>
          <ul>{this.messageList(chat)}</ul>
          <input type="text" ref={node => this.chat = node} />
          <button onClick={() => this.handleAdd('chat', currentGameId)}>Add</button>
        </section>
        <section id="private">
          <h2>Private Messages</h2>
          <ul>{this.messageList(sideChat)}</ul>
          <input type="text" ref={node => this[side] = node} />
          <button onClick={() => this.handleAdd(side, currentGameId)}>Add</button>
        </section>
      </section>
    )
  }
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
    ({ firebase: { data: {chat, sideChat }} }) => ({ 
      chat,
      sideChat
    })
  )
)(Chat)

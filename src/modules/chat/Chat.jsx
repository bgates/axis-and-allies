import React, { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase'
import '../../assets/styles/chat.css'

class Messages extends Component {

  handleAdd () {
    const msg = this.msg
    this.props.firebase.push(this.props.node, { text: msg.value })
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

class Chat extends Component {

  render () {
    const { chat, sideChat, profile, firebase } = this.props 
    const { axis, currentGameId }= profile
    const side = axis ? 'axisChat' : 'alliesChat'
    return (
      <section className="chat">
        <Messages 
          type="Public" 
          list={chat} 
          firebase={firebase}
          node={`/chat/${currentGameId}`} />
        <Messages 
          type="Private" 
          list={sideChat} 
          firebase={firebase}
          node={`/${side}/${currentGameId}`} />
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

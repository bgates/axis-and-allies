import React, { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase'

class Chat extends Component {

  handleAdd () {
    const { newMessage } = this.refs
    this.props.firebase.push('/messages', { text: newMessage.value })
    newMessage.value = ''
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
    const { messages } = this.props /* also firebase is in props */
    return (
      <section id="chat">
        <h2>Messages</h2>
        <ul>{this.messageList(messages)}</ul>
        <input type="text" ref="newMessage" />
        <button onClick={this.handleAdd.bind(this)}>Add</button>
      </section>
    )
  }
}

export default compose(
  firebaseConnect([
    '/messages' 
  ]),
  connect(
    ({ firebase: { data: { messages } } }) => ({ // state.firebase.data.todos
      messages // Connect props.todos to state.firebase.data.todos
    })
  )
)(Chat)

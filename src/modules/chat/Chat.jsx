import React, { Component } from 'react'
import { connect } from 'react-redux'
import { firebase, helpers } from 'redux-react-firebase'

const { isLoaded, isEmpty, dataToJS } = helpers

@firebase([
  '/messages'
])
@connect(
  ({ firebase }) => ({
    messages: dataToJS(firebase, 'messages')
  })
)

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
    const { firebase, messages } = this.props
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
export default Chat

import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { compose } from 'redux'
import { connect } from 'react-redux'
import {
  firebaseConnect,
  isEmpty
} from 'react-redux-firebase'
import { BoardContainer } from './modules/board'
import Chat from './modules/chat'
import { LoginContainer } from './modules/login'
import { CreateGameContainer } from './modules/createGame'

const Game = ({ authError, auth, profile }) => (    
  <div>
    <LoginContainer />
    <BoardContainer />
    {!isEmpty(auth) && <Chat profile={profile} />}
  </div>
)

const GameContainer = compose(firebaseConnect(),
  connect(
    ({ firebase: { authError, auth, profile } }) => ({ 
      authError, auth, profile
    })
  )
)(Game)

const App = () => ( 
  <Switch>
    <Route path='/create-game' component={CreateGameContainer} />
    <Route component={GameContainer} />
  </Switch>
)

export default App


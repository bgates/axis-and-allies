// @flow
import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { compose } from 'redux'
import { connect } from 'react-redux'
import {
  firebaseConnect,
  isEmpty
} from 'react-redux-firebase'
import { BoardContainer } from './modules/main/board'
import { 
  Chat,
  LoginContainer,
  CreateGameContainer
} from './modules/online'

const Game = ({ auth, profile }) => (    
  <div>
    <LoginContainer />
    <BoardContainer profile={profile} />
    {!isEmpty(auth) && <Chat profile={profile} />}
  </div>
)

const GameContainer = compose(firebaseConnect(),
  connect(
    ({ firebase: { auth, profile } }) => ({ 
      auth, profile
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


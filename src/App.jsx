import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { BoardContainer } from './modules/board'
import Chat from './modules/chat'
import { CreateGameContainer } from './modules/createGame'

const Game = () => (    
  <div>
    <BoardContainer />
    <Chat />
  </div>
)

const App = () => ( 
  <Switch>
    <Route path='/create-game' component={CreateGameContainer} />
    <Route component={Game} />
  </Switch>
)

export default App


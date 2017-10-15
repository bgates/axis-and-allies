import reactDOM from 'react-dom'
import React from 'react'
import { Provider } from 'react-redux'
import { ConnectedRouter as Router } from 'connected-react-router'
import configureStore, { history } from './config/configureStore'
import App from './App'
import observe from './observers'
import './assets/styles/index.css'

const store = configureStore()
observe(store) 

reactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>, document.getElementById('root')
)


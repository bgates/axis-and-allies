'use strict'

import React from 'react'
import ResearchContainer from './ResearchContainer'
import configureStore from 'redux-mock-store'
import { shallow } from 'enzyme'

it('renders correctly', () => {
  const mockStore = configureStore()
  const initialState = {
    powers: [ { tech: [], ipc: 56 } ],
    currentPowerIndex: 0
  }
  const store = mockStore(initialState)
  const container = shallow(
    <ResearchContainer store={store} />
  )
  expect(container.length).toEqual(1)
})



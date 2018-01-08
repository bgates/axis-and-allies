'use strict'

import React from 'react'
import PowersContainer from './PowersContainer'
import Powers from './Powers'
import configureStore from 'redux-mock-store'
import { shallow, mount } from 'enzyme'

describe('PowersContainer', () => {
  let store

  beforeEach(() => {
    const mockStore = configureStore()
    const initialState = {
      powers: [ { ipc: 56, name: 'Germany' } ],
      currentPowerIndex: 0,
      territories: [{ currentPower: 'Germany' }]
    }
    store = mockStore(initialState)
  })

  it('renders correctly', () => {
    const container = shallow(
      <PowersContainer store={store} />
    )
    expect(container.length).toEqual(1)
  })
})

'use strict'

import React from 'react'
import IncomeContainer from './IncomeContainer'
//import IncomeModal from './IncomeModal'
import thunk from 'redux-thunk'
import { initialState as unitsAndTerritories } from '../../config/configureStore'
import powers from '../../config/initialPowers'
import configureStore from 'redux-mock-store'
import { shallow } from 'enzyme'

describe('IncomeContainer', () => {
  const mockStore = configureStore([thunk])

  const initialState = {
    powers,
    currentPowerIndex: 0,
    ...unitsAndTerritories
  }
  let store = mockStore(initialState)
  it('renders correctly', () => {
    const container = shallow(
      <IncomeContainer store={store} />
    )
    expect(container.length).toEqual(1)
  })
})

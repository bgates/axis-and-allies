'use strict'

import React from 'react'
import TooltipContainer from './TooltipContainer'
import { initialState as unitsAndTerritories } from '../../config/configureStore'
import powers from '../../config/initialPowers'
import configureStore from 'redux-mock-store'
import { shallow } from 'enzyme'

describe('TooltipContainer', () => {
  const mockStore = configureStore()

  const initialState = {
    powers,
    currentPowerIndex: 0,
    unitOrigin: {},
    unitDestination: {},
    landPlanes: {},
    placement: {},
    ...unitsAndTerritories
  }
  let store = mockStore(initialState)
  it('renders correctly', () => {
    const container = shallow(
      <TooltipContainer store={store} playing={true} territoryIndex={100} />
    )
    expect(container.length).toEqual(1)
  })
})


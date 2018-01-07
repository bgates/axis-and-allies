'use strict'

import React from 'react'
import ResearchContainer from './ResearchContainer'
import ResearchModal from './ResearchModal'
import thunk from 'redux-thunk'
import { push } from 'connected-react-router'
import { mockRandom } from '../../setupTests'
import { 
  ROLLS,
  SET_TECH, 
  INCREASE_RESEARCH_BUDGET,
  DECREASE_RESEARCH_BUDGET,
  ATTEMPT_RESEARCH,
  DEVELOP_TECH
} from '../../actions'
import PATHS from '../../paths'
import configureStore from 'redux-mock-store'
import { MemoryRouter } from 'react-router'
import { shallow, mount } from 'enzyme'

describe('ResearchContainer', () => {
  let store

  beforeEach(() => {
    const mockStore = configureStore()
    const initialState = {
      powers: [ { tech: [], ipc: 56, name: 'Germany' } ],
      currentPowerIndex: 0,
      research: { selectedTech: 'Radar', attempts: 1 }
    }
    store = mockStore(initialState)
  })

  it('renders correctly', () => {
    const container = shallow(
      <ResearchContainer store={store} />
    )
    expect(container.length).toEqual(1)
  })

  describe('when setting a technology', () => {
    let container
    beforeEach(() => {
      container = mount(
        <MemoryRouter>
          <ResearchContainer store={store} />
        </MemoryRouter>
      )
    })
    it('dispatches an action', () => {
      container.find('li>button.jets').simulate('click')
      const actions = store.getActions()
      const expected = [{ type: SET_TECH, tech: 'Jet Power' }]
      expect(actions).toEqual(expected)
    })
    it('can increment research budget', () => {
      container.find('span>button[children="+"]').simulate('click')
      const actions = store.getActions()
      const expected = [
        { type: INCREASE_RESEARCH_BUDGET }
      ]
      expect(actions).toEqual(expected)
    })
    it('can decrement research budget', () => {
      container.find('span>button[children="-"]').simulate('click')
      const actions = store.getActions()
      const expected = [
        { type: DECREASE_RESEARCH_BUDGET }
      ]
      expect(actions).toEqual(expected)
    })
  })

})
describe('when attempting research', () => {
  let store, container

  beforeEach(() => {
    const mockStore = configureStore([thunk])
    const initialState = {
      powers: [ { tech: [], ipc: 56, name: 'Germany' } ],
      currentPowerIndex: 0,
      research: { selectedTech: 'Radar', attempts: 1 },
      firebase: { profile: {} }
    }
    store = mockStore(initialState)
    
    container = mount(
      <MemoryRouter>
        <ResearchContainer store={store} />
      </MemoryRouter>
    )
  })
  it('can succeed', () => {
    mockRandom(() => 1)

    const expected = [
      { type: ROLLS, phase: PATHS.RESEARCH_RESULTS, rolls: [6] },
      { type: ATTEMPT_RESEARCH, currentPowerIndex: 0, cost: 4 },
      { type: DEVELOP_TECH, currentPowerIndex: 0, tech: 'Radar' },
      push(PATHS.RESEARCH_RESULTS)
    ]
    container.find('span>button[children="Spend"]').simulate('click')
    const actions = store.getActions()
    expect(actions).toEqual(expected)
  })
  it('can fail', () => {
    mockRandom(() => 1 / 6)

    const expected = [
      { type: ROLLS, phase: PATHS.RESEARCH_RESULTS, rolls: [1] },
      { type: ATTEMPT_RESEARCH, currentPowerIndex: 0, cost: 4 },
      push(PATHS.RESEARCH_RESULTS)
    ]
    container.find('span>button[children="Spend"]').simulate('click')
    const actions = store.getActions()
    expect(actions).toEqual(expected)
  })
})

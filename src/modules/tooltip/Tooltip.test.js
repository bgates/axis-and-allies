'use strict'

import React from 'react'
import Tooltip from './Tooltip'
import { mount } from 'enzyme'
import { MemoryRouter } from 'react-router'

test('root shows initial tooltip for current player', () => {
  const wrapper = mount(
    <MemoryRouter initialEntries={[ '/' ]}>
      <Tooltip units={[]} playing={true}/>
    </MemoryRouter>
  );
  expect(wrapper.text()).toMatch(/This is the start/)
})

test('root shows initial tooltip for other player', () => {
  const wrapper = mount(
    <MemoryRouter initialEntries={[ '/' ]}>
      <Tooltip units={[]} playing={false}/>
    </MemoryRouter>
  );
  expect(wrapper.text()).toMatch(/wait for your/)
})

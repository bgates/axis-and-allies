'use strict'

import React from 'react'
import Tooltip from './Tooltip'
import { mount } from 'enzyme'
import toJson from 'enzyme-to-json'
import { MemoryRouter } from 'react-router'
import PATHS from '../../paths'

const entry = pathname => [ { pathname, key: 'testkey' } ]
test('root shows initial tooltip for current player', () => {
  const wrapper = mount(
    <MemoryRouter initialEntries={entry('/')}>
      <Tooltip units={[]} playing={true}/>
    </MemoryRouter>
  )
  expect(toJson(wrapper.find(Tooltip))).toMatchSnapshot()
})

test('root shows initial tooltip for other player', () => {
  const wrapper = mount(
    <MemoryRouter initialEntries={entry('/')}>
      <Tooltip units={[]} playing={false}/>
    </MemoryRouter>
  )
  expect(toJson(wrapper.find(Tooltip))).toMatchSnapshot()
})

test('repair path tooltip', () => {
  const wrapper = mount(
    <MemoryRouter initialEntries={entry(PATHS.REPAIR)}>
      <Tooltip units={[]} />
    </MemoryRouter>
  )
  expect(toJson(wrapper.find(Tooltip))).toMatchSnapshot()
})
test('plan attacks path tooltip', () => {
  const wrapper = mount(
    <MemoryRouter initialEntries={entry(PATHS.PLAN_ATTACKS)}>
      <Tooltip units={[]} />
    </MemoryRouter>
  )
  expect(toJson(wrapper.find(Tooltip))).toMatchSnapshot()
})

test('resolve combat path tooltip', () => {
  const wrapper = mount(
    <MemoryRouter initialEntries={entry(PATHS.RESOLVE_COMBAT)}>
      <Tooltip units={[]} />
    </MemoryRouter>
  )
  expect(toJson(wrapper.find(Tooltip))).toMatchSnapshot()
})

test('land planes path tooltip', () => {
  const wrapper = mount(
    <MemoryRouter initialEntries={entry(PATHS.LAND_PLANES)}>
      <Tooltip units={[]} />
    </MemoryRouter>
  )
  expect(toJson(wrapper.find(Tooltip))).toMatchSnapshot()
})

test('plan movement path tooltip', () => {
  const wrapper = mount(
    <MemoryRouter initialEntries={entry(PATHS.PLAN_MOVEMENT)}>
      <Tooltip units={[]} />
    </MemoryRouter>
  )
  expect(toJson(wrapper.find(Tooltip))).toMatchSnapshot()
})

test('order units path tooltip', () => {
  const wrapper = mount(
    <MemoryRouter initialEntries={entry(PATHS.ORDER_UNITS)}>
      <Tooltip units={[]} />
    </MemoryRouter>
  )
  expect(toJson(wrapper.find(Tooltip))).toMatchSnapshot()
})

test('confirm finish path tooltip', () => {
  const wrapper = mount(
    <MemoryRouter initialEntries={entry(PATHS.CONFIRM_FINISH)}>
      <Tooltip units={[]} />
    </MemoryRouter>
  )
  expect(toJson(wrapper.find(Tooltip))).toMatchSnapshot()
})

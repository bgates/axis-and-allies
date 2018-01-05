'use strict'

import React from 'react'
import Dice from './Dice'
import renderer from 'react-test-renderer'

const mockMath = Object.create(global.Math)
mockMath.random = () => 0.5
global.Math = mockMath

it('renders correctly', () => {
  const tree = renderer.create(
    <Dice rolls={[1]} goalFunction={n => n} />
  ).toJSON()
  expect(tree).toMatchSnapshot()
})


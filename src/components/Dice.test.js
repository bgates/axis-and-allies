'use strict'

import React from 'react'
import Dice from './Dice'
import renderer from 'react-test-renderer'
import { mockRandom } from '../setupTests'

mockRandom(() => 0.5)

it('renders correctly', () => {
  const tree = renderer.create(
    <Dice rolls={[1]} goalFunction={n => n} />
  ).toJSON()
  expect(tree).toMatchSnapshot()
})


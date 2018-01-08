'use strict'

import React from 'react'
import DiceResultsModal from './DiceResultsModal'
import renderer from 'react-test-renderer'
import { mockRandom } from '../setupTests'

mockRandom(() => 0.5)

it('renders correctly', () => {
  const tree = renderer.create(
    <DiceResultsModal rolls={[1]} goalFunction={n => n} />
  ).toJSON()
  expect(tree).toMatchSnapshot()
})


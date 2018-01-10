'use strict'

import React from 'react'
import Attacker from './Attacker'
import renderer from 'react-test-renderer'

it('renders correctly', () => {
  const unit = { type: 'infantry', power: 'Germany', ids: [1] }
  const tree = renderer.create(
    <Attacker unit={unit} committed={[]} />
  ).toJSON()
  expect(tree).toMatchSnapshot()
})


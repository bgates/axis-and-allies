'use strict'

import React from 'react'
import Die from './Die'
import renderer from 'react-test-renderer'

it('renders correctly', () => {
  const tree = renderer.create(
    <Die rotateX={0.5} rotateY={0.5} duration={3} />
  ).toJSON()
  expect(tree).toMatchSnapshot()
})

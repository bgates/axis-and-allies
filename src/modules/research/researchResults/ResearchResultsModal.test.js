'use strict'

import React from 'react'
import ResearchResultsModal from './ResearchResultsModal'
import { MemoryRouter } from 'react-router'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import { mockRandom } from '../../setupTests'

mockRandom(() => 0.5)

it('renders correctly', () => {
  const tree = shallow(
    <MemoryRouter>
      <ResearchResultsModal rolls={[1,2]} tech={[]}/>
    </MemoryRouter>
  )
  expect(toJson(tree.find(ResearchResultsModal))).toMatchSnapshot()
})



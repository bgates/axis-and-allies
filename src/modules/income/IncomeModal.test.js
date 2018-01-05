'use strict'

import React from 'react'
import { MemoryRouter } from 'react-router'
import IncomeModal from './IncomeModal'
import renderer from 'react-test-renderer'

it('renders correctly', () => {
  const objectives = [ 
    { text: 'goal 1', value: 1 }, { text: 'goal 2', value: 2 }
  ]
  const tree = renderer.create(
    <MemoryRouter>
      <IncomeModal 
        currentPower={ { name: 'Germany' } }
        npl={60}
        objectives={objectives}
        nextNpl={63}
        setIncome={() => {}}
      />
    </MemoryRouter>
  ).toJSON()
  expect(tree).toMatchSnapshot()
})


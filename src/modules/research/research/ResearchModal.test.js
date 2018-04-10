'use strict'

import React from 'react'
import ResearchModal from './ResearchModal'
import { MemoryRouter } from 'react-router'
import renderer from 'react-test-renderer'

it('renders correctly', () => {
  const currentPower = { tech: [], ipc: 56 }
  const research = { attempts: 0, cost: 4, availableTech: [
    { abbr: 'jets', name: 'jet power', text: 'make jets' },
    { abbr: 'subs', name: 'submarines', text: 'improve subs' }
  ]}
  const setTech = name => null
  const tree = renderer.create(
    <MemoryRouter>
      <ResearchModal 
        currentPower={currentPower}
        research={research}
        setTech={setTech}
      />
    </MemoryRouter>
  ).toJSON()
  expect(tree).toMatchSnapshot()
})


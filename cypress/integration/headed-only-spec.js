/// <reference types="cypress" />
import { onlyOn } from '../..'

onlyOn('headed', () => {
  it('runs the current test only in headed mode', () => {
    cy.wrap(true).should('equal', true)
  })
})

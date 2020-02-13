/// <reference path="../../index.d.ts" />
// @ts-check
it('skip test on Mac using custom command', () => {
  cy.log('about to run custom command to skip this test')
    .wait(1000)
    .skipOn('mac')
})

it('skips this test on Electron', () => {
  cy.skipOn('electron')
})

it('skips this test when visiting example.cypress.io', () => {
  // cy.visit('https://example.cypress.io')
  cy.log('skip on example.cypress.io')
  cy.skipOn('example.cypress.io')
})

it('combination of skip and only', () => {
  cy.log('skip on FF')
  cy.log('only runs on Electron on Mac')

  cy.skipOn('firefox')
  cy.onlyOn('electron').onlyOn('mac')
  cy.log('running test')
})

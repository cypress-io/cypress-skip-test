/// <reference path="../../index.d.ts" />
// @ts-check
it('skip test using custom command', () => {
  cy.log('about to run custom command to skip this test')
    .wait(1000)
    .skipOn('mac')
})

it('skips on Electron', () => {
  cy.skipOn('electron')
})

it('skips on example.cypress.io', () => {
  // cy.visit('https://example.cypress.io')
  cy.skipOn('example.cypress.io')
})

it('combination of skip and only', () => {
  cy.skipOn('firefox')
  cy.onlyOn('electron').onlyOn('mac')
  cy.log('running test')
})

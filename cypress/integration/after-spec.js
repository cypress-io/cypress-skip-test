/// <reference path="../../index.d.ts" />
// @ts-check
it('runs after hooks after skipping?', () => {
  cy.skipOn('mac')
})

it('does not skip this test', () => {})

afterEach(() => {
  // this will be skipped when a test is skipped
  cy.log('in afterEach')
  console.log('in afterEach for', cy)
})

after(() => {
  // this will run after skipping test
  cy.log('in after')
  console.log('in after')
})

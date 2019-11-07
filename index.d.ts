/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject> {
    /**
    * Skip current test if running on a given platform or browser
    * @see https://github.com/cypress-io/cypress-skip-test
    * @example
    * cy.skipOn('windows')
    *   .skipOn('electron')
    */
   skipOn(name: string): Chainable<Subject>
  }
}

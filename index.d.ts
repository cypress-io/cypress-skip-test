/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject> {
    /**
    * Skips the current test if running on a given platform or browser
    * @see https://github.com/cypress-io/cypress-skip-test
    * @example
    * // skips the current test on Windows,
    * // also skips if running in Electron
    * cy.skipOn('windows')
    *   .skipOn('electron')
    */
    skipOn(name: string): Chainable<Subject>

    /**
    * Only runs the current test if the current browser or platform matches the given name
    * @see https://github.com/cypress-io/cypress-skip-test
    * @example
    * cy.onlyOn('darwin')
    */
    onlyOn(name: string): Chainable<Subject>
  }
}

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
    * @example
    * // skip the test if S is "foo"
    * cy.skipOn(S === 'foo')
    *
    * @example
    ```
    // skip entire block of tests on Firefox
    // without starting them
    skipOn('firefox', () => {
        it('works', () => {...})
        it('works too', () => {...})
    })
    ```
    */
    skipOn(nameOrFlag: string | boolean, cb?: () => void): Chainable<Subject>

    /**
    * Only runs the current test if the current browser or platform matches the given name
    * @see https://github.com/cypress-io/cypress-skip-test
    * @example
    * // run this test on Mac
    * cy.onlyOn('darwin')
    * @example
    * // run this test if S is "foo"
    * cy.onlyOn(S === 'foo')
    * @example
    ```
    // run this group of tests against localhost only
    onlyOn('localhost', () => {
        it('works', () => {...})
        it('works too', () => {...})
    })
    ```
    */
    onlyOn(nameOrFlag: string | boolean, cb?: () => void): Chainable<Subject>
  }
}

export const skipOn: (
  nameOrFlag: string | boolean,
  cb?: () => void
) => Cypress.Chainable<any>
export const onlyOn: (
  nameOrFlag: string | boolean,
  cb?: () => void
) => Cypress.Chainable<any>
export const isOn: (name: string) => boolean

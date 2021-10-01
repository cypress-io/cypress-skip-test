const spok = require('spok').default
const cypress = require('cypress')
const assert = require('assert')
const debug = require('debug')('test')

/* eslint-env mocha */
describe('skipping at run-time', () => {
  // particular test we want to focus on
  const title = 'skips this test on Electron'

  const assertResults = (results) => {
    // let's confirm the number of tests
    // and maybe some additional information
    debug('results %o', results)

    spok(assert, results, {
      totalSuites: 0,
      totalTests: 4,
      runs: spok.array
    })
    assert(results.runs.length === 1, 'single run')
  }

  const findOurTest = (results) => {
    debug('looking for test with title "%s"', title)
    const testSkippedOnElectron = results.runs[0].tests.find(
      (t) => t.title[0] === title
    )
    debug('found test %o', testSkippedOnElectron)
    assert(testSkippedOnElectron, 'could not find test')
    return testSkippedOnElectron
  }

  it('skips test on Electron', () => {
    // by default the test runs on Electron
    return cypress
      .run({
        spec: 'cypress/integration/spec.js',
        browser: 'electron',
        headless: true,
        video: false
      })
      .then((results) => {
        assertResults(results)
        const test = findOurTest(results)
        debug('found test object %o', test)

        // the test should be pending (which means it was skipped)
        // Cypress v6+ puts error in attempts array
        if (Array.isArray(test.attempts)) {
          spok(assert, test, {
            title,
            state: 'pending'
          })
          const lastAttempt = test.attempts[test.attempts.length - 1]
          debug('last attempt %o', lastAttempt)

          spok(assert, lastAttempt, {
            state: 'pending',
            error: {
              message: 'sync skip; aborting execution'
            }
          })
        } else {
          spok(assert, test, {
            title,
            state: 'pending',
            error: 'sync skip; aborting execution'
          })
        }
      })
  })

  it('does not skip test in Chrome', () => {
    return cypress
      .run({
        spec: 'cypress/integration/spec.js',
        browser: 'chrome',
        video: false
      })
      .then((results) => {
        assertResults(results)
        const test = findOurTest(results)

        // the test should be pending (which means it was skipped)
        spok(assert, test, {
          title,
          state: 'passed',
          error: null
        })
      })
  })
})

const spok = require('spok').default
const cypress = require('cypress')
const assert = require('assert')
const debug = require('debug')('test')

/* eslint-env mocha */
describe('skipping at run-time', () => {
  it('skips test on Electron', () => {
    // by default the test runs on Electron
    return cypress
      .run({
        spec: 'cypress/integration/spec.js'
      })
      .then(results => {
        // let's confirm the number of tests
        // and maybe some additional information
        debug('results %o', results)

        spok(assert, results, {
          totalSuites: 0,
          totalTests: 4,
          runs: spok.array
        })
        assert(results.runs.length === 1, 'single run')

        // let's look at the run, and at particular tests
        const title = 'skips on Electron'
        const testSkippedOnElectron = results.runs[0].tests.find(
          t => t.title[0] === title
        )
        debug('found test %o', testSkippedOnElectron)

        // the test should be pending (which means it was skipped)
        spok(assert, testSkippedOnElectron, {
          title,
          state: 'pending',
          error: null
        })
      })
  })
})

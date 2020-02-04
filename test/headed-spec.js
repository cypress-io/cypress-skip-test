const spok = require('spok').default
const cypress = require('cypress')
const assert = require('assert')
const debug = require('debug')('test')

const assertResults = results => {
  // let's confirm the number of tests
  // and maybe some additional information
  debug('results %o', results)

  spok(assert, results, {
    totalSuites: 0,
    totalTests: 1,
    runs: spok.array
  })
  assert(results.runs.length === 1, 'single run')
}

const shouldHaveTest = (title, state, results) => {
  assert(results.runs.length === 1, 'there should be just a single run')
  const test = results.runs[0].tests.find(t => t.title[0] === title)
  debug('found test %o', test)
  assert(test, 'could not find test')

  spok(assert, test, {
    title,
    state,
    // there should not be any errors
    error: null
  })
}

/* eslint-env mocha */
describe('skipping test in headed mode', () => {
  it('runs the test in headless mode', () => {
    return cypress
      .run({
        spec: 'cypress/integration/headed-spec.js',
        headed: false,
        video: false
      })
      .then(results => {
        assertResults(results)
        shouldHaveTest(
          'skips the current test in headed mode',
          'passed',
          results
        )
      })
  })

  it('skips test in headed mode', () => {
    return cypress
      .run({
        spec: 'cypress/integration/headed-spec.js',
        headed: true,
        video: false
      })
      .then(results => {
        assertResults(results)
        // the plugin automatically replaces any tests in skipped block
        // with a single dummy test with this name
        shouldHaveTest('Skipping test(s) in headed mode', 'pending', results)
      })
  })
})

describe('only running test in headed mode', () => {
  it('runs the test in headed mode', () => {
    return cypress
      .run({
        spec: 'cypress/integration/headed-only-spec.js',
        headed: true,
        video: false
      })
      .then(results => {
        assertResults(results)
        shouldHaveTest(
          'runs the current test only in headed mode',
          'passed',
          results
        )
      })
  })

  it('skips test in headless mode', () => {
    return cypress
      .run({
        spec: 'cypress/integration/headed-only-spec.js',
        headed: false,
        video: false
      })
      .then(results => {
        assertResults(results)
        shouldHaveTest('Skipping test(s), not on headed', 'pending', results)
      })
  })
})

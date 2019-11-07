/// <reference types="cypress" />
import { onlyOn, skipOn } from '../..'

onlyOn('mac', () => {
  // this callback will only evaluate on Mac
  // thus the tests will be completely hidden from other platforms
  describe('Mac tests', () => {
    it('works', () => {})
  })
})

skipOn('mac', () => {
  it('hides this test on Mac', () => {})
})

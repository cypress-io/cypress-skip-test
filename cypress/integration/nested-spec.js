/// <reference types="cypress" />
import { onlyOn } from '../..'

// run these group of tests only on Mac and only on Chrome
onlyOn('mac', () => {
  onlyOn('chrome', () => {
    it('works', () => {})
  })
})

onlyOn('mac', () => {
  onlyOn('electron', () => {
    it('runs on Mac Electron', () => {})
  })
})

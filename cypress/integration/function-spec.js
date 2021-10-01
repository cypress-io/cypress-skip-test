/// <reference types="cypress" />
import { onlyOn, skipOn } from '../..'

const functionReturningTrue = () => true
const asyncFunctionReturningTrue = () => new Promise((resolve) => resolve(true))

it('runs on true', () => {
  onlyOn(functionReturningTrue())
})

it('skips on true', () => {
  skipOn(functionReturningTrue())
})

onlyOn(functionReturningTrue(), () => {
  it('runs it as callback', () => {})
})

skipOn(functionReturningTrue(), () => {
  it('skips this completely', () => {})
})

it('runs on true', () => {
  onlyOn(asyncFunctionReturningTrue())
})

it('skips on true', () => {
  skipOn(asyncFunctionReturningTrue())
})

onlyOn(asyncFunctionReturningTrue(), () => {
  it('runs it as callback', () => {})
})

skipOn(asyncFunctionReturningTrue(), () => {
  it('skips this completely', () => {})
})

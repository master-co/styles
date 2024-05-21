import { it, test, expect } from 'vitest'
import { MasterCSS } from '../../src'
import areRuleQueriesEqual from '../../src/utils/are-rule-queries-equal'

test.concurrent('min-width', () => {
    expect(areRuleQueriesEqual(
        new MasterCSS().generate('font:16@sm')[0],
        new MasterCSS().generate('font:32@sm')[0])
    ).toBeTruthy()
})

test.concurrent('range', () => {
    expect(areRuleQueriesEqual(
        new MasterCSS().generate('font:16@sm&md')[0],
        new MasterCSS().generate('font:32@md&sm')[0])
    ).toBeTruthy()
})

test.concurrent('no at-token', () => {
    expect(areRuleQueriesEqual(
        new MasterCSS().generate('font:16')[0],
        new MasterCSS().generate('font:32@sm')[0])
    ).toBeFalsy()
})

test.concurrent('supports and media', () => {
    expect(areRuleQueriesEqual(
        new MasterCSS().generate('font:16@sm')[0],
        new MasterCSS().generate('font:32@sm@supports(backdrop-filter:none)')[0])
    ).toBeFalsy()
})
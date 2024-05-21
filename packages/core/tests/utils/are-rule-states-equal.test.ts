import { it, test, expect } from 'vitest'
import { MasterCSS } from '../../src'
import areRuleStatesEqual from '../../src/utils/are-rule-states-equal'

test.concurrent('states', () => {
    expect(areRuleStatesEqual(
        new MasterCSS().generate('font:16:hover@sm')[0],
        new MasterCSS().generate('font:32:hover@sm')[0])
    ).toBeTruthy()

    expect(areRuleStatesEqual(
        new MasterCSS().generate('font:16:hover@sm')[0],
        new MasterCSS().generate('font:32:focus@sm')[0])
    ).toBeFalsy()
})
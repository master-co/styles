import { it, test, expect } from 'vitest'
import { MasterCSS } from '../../src'
import areRulesDuplicated from '../../src/utils/are-syntaxes-duplicated'

test.concurrent('syntaxes', () => {
    expect(areRulesDuplicated(
        new MasterCSS().generate('font:16')[0],
        new MasterCSS().generate('font:32')[0])
    ).toBeTruthy()

    expect(areRulesDuplicated(
        new MasterCSS().generate('text:16')[0],
        new MasterCSS().generate('font:32')[0])
    ).toBeFalsy()

    expect(areRulesDuplicated(
        new MasterCSS().generate('block')[0],
        new MasterCSS().generate('display:none')[0])
    ).toBeTruthy()
})
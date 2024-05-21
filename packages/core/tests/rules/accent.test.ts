import { it, test, expect } from 'vitest'
import { MasterCSS } from '../../src'

test.concurrent('accent', () => {
    expect(new MasterCSS().create('accent:current')?.text).toContain('accent-color:currentColor')
    // expect(new MasterCSS().create('accent:transparent')?.text).toContain('accent-color:transparent')
})

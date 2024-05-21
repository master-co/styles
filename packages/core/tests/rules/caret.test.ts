import { it, test, expect } from 'vitest'
import { MasterCSS } from '../../src'

test.concurrent('caret', () => {
    expect(new MasterCSS().create('caret:current')?.text).toContain('caret-color:currentColor')
    expect(new MasterCSS().create('caret:transparent')?.text).toContain('caret-color:transparent')
})

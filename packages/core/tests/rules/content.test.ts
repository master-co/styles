import { it, test, expect } from 'vitest'
import { MasterCSS } from '../../src'

test('content', () => {
    // expect(new MasterCSS().create('content:\'foo\'')?.text).toBe('.content\\:\\\'foo\\\'{content:\'foo\'}')
    expect(new MasterCSS().create('content:\'fo\\\'o\'')?.text).toContain('content:\'fo\\\'o\'')
})

import { it, test, expect } from 'vitest'
import { MasterCSS } from '../../src'

test('writing', () => {
    expect(new MasterCSS().create('writing:rl')?.text).toContain('writing-mode:rl')
})

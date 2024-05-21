import { it, test, expect } from 'vitest'
import { MasterCSS } from '../../src'

test('letter-spacing', () => {
    expect(new MasterCSS().create('tracking:-.25em')?.text).toBe('.tracking\\:-\\.25em{letter-spacing:-0.25em}')
})
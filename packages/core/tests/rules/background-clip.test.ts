import { it, test, expect } from 'vitest'
import { MasterCSS } from '../../src'

it('background clip', () => {
    expect(new MasterCSS().create('bg-clip:text')?.text).toContain('-webkit-background-clip:text;background-clip:text')
})

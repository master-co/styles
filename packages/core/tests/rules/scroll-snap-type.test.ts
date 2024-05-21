import { it, test, expect } from 'vitest'
import { MasterCSS } from '../../src'

test.concurrent('scroll-snap-type', () => {
    expect(new MasterCSS().create('scroll-snap:x')?.text).toContain('scroll-snap-type:x')
    expect(new MasterCSS().create('scroll-snap-type:x')?.text).toContain('scroll-snap-type:x')
    expect(new MasterCSS().create('scroll-snap-type:x|mandatory')?.text).toContain('scroll-snap-type:x mandatory')
})

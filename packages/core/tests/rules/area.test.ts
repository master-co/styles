import { it, test, expect } from 'vitest'
import { MasterCSS } from '../../src'

test.concurrent('area', () => {
    expect(new MasterCSS().create('full')?.text).toContain('width:100%;height:100%')
})

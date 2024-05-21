import { it, test, expect } from 'vitest'
import { MasterCSS } from '../../src'

test.concurrent('box', () => {
    expect(new MasterCSS().create('box:content')?.text).toContain('box-sizing:content-box')
    expect(new MasterCSS().create('box-sizing:content-box')?.text).toContain('box-sizing:content-box')
})
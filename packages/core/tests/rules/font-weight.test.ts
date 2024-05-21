import { it, test, expect } from 'vitest'
import { MasterCSS } from '../../src'

test.concurrent('font-weight', () => {
    expect(new MasterCSS().create('font:bolder')?.text).toBe('.font\\:bolder{font-weight:bolder}')
    expect(new MasterCSS().create('font:thin')?.text).toBe('.font\\:thin{font-weight:100}')
})

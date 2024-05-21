import { it, test, expect } from 'vitest'
import { MasterCSS } from '../../src'

it.concurrent('flex', () => {
    expect(new MasterCSS().create('flex:1|1|auto')?.text).toBe('.flex\\:1\\|1\\|auto{flex:1 1 auto}')
    // expect(new MasterCSS().create('flex:hover')?.text).toBe('.flex\\:hover{flex: hover}')
})

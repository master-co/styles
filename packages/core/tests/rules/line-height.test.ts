import { it, test, expect } from 'vitest'
import { MasterCSS } from '../../src'

test.concurrent('line-height', () => {
    expect(new MasterCSS().create('line-h:calc(2-1.5)')?.text).toBe('.line-h\\:calc\\(2-1\\.5\\){line-height:calc(2 - 1.5)}')
})

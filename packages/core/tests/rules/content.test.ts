import { it, test, expect } from 'vitest'
import { MasterCSS } from '../../src'

test.concurrent('content', () => {
    expect(new MasterCSS().create('content:\'fo\\\'o\'')?.text).toContain('content:\'fo\\\'o\'')
})

test.concurrent('variable', () => {
    expect(new MasterCSS({
        variables: {
            content: { external: '" ↗"' }
        }
    }).create('content:external:after')?.text).toBe('.content\\:external\\:after:after{content:" ↗"}')
})
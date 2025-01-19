// @vitest-environment jsdom
import { describe, expect, test } from 'vitest'
import hydrate from '../../hydrate'

describe('hydration', async () => {
    const { runtimeCSS } = await hydrate(import.meta.url)

    test('base', () => {
        expect(runtimeCSS.generalLayer.rules[0]).toMatchObject({
            name: 'hidden@light',
            nodes: [
                {
                    native: { selectorText: '.light .hidden\\@light' },
                    text: '.light .hidden\\@light{display:none}'
                }
            ]
        })
    })
})



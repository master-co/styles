// @vitest-environment jsdom
import { describe, expect, test } from 'vitest'
import hydrate from '../../hydrate'

describe('hydration', async () => {
    const { runtimeCSS, generated } = await hydrate(import.meta.url)

    test('base', () => {
        expect(runtimeCSS.generalLayer.rules[0]).toMatchObject({
            name: 'content:external:after',
            nodes: [
                {
                    native: { selectorText: '.content\\:external\\:after:after' },
                    text: '.content\\:external\\:after:after{content:" ↗"}'
                }
            ]
        })
    })
})



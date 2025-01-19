// @vitest-environment jsdom
import { describe, expect, test } from 'vitest'
import hydrate from '../../hydrate'

describe('hydration', async () => {
    const { runtimeCSS } = await hydrate(import.meta.url)

    test('base', () => {
        expect(runtimeCSS.themeLayer.usages).toEqual({ primary: 3 })
    })
})



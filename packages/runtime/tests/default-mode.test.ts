import { it, expect } from 'vitest'
import { withRuntimeCSS } from './setup'

withRuntimeCSS([
    '@layer theme{',
    ':root{--base:0 0 0}',
    '.dark{--base:34 33 35}',
    '.light, :root{--base:255 255 255}',
    '}'
], undefined, (context) => {
    it('should contain prerendering CSS text after observing', () => {
        expect(context.runtimeCSS.themeLayer.text).toEqual(context.preRenderedTexts.join(''))
    })
})

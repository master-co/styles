import { it, expect } from 'vitest'
import { withRuntimeCSS } from './setup'

withRuntimeCSS([
    ':root{--base:0 0 0}',
    '.dark{--base:34 33 35}',
    '.light, :root{--base:255 255 255}',
], undefined, (context) => {
    it('should contain prerendering CSS text after observing', () => {
        expect(context.runtimeCSS.syntaxes[0].text).toEqual(context.preRenderedTexts.join(''))
    })
})

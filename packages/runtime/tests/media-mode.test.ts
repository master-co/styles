import { it, expect } from 'vitest'
import { withRuntimeCSS } from './setup'

withRuntimeCSS([
    '@layer theme { ',
    '@media(prefers-color-scheme:light){:root{--base:34 33 35}}',
    '@media(prefers-color-scheme:dark){:root{--base:255 255 255}}',
    ' }'
], {
    modes: { dark: 'media', light: 'media' }
}, (context) => {
    it('should contain prerendering CSS text after observing', () => {
        // console.log(context.runtimeCSS)
        expect(context.runtimeCSS.themeLayer.text).toEqual(context.preRenderedTexts.join(''))
    })
})

import { test, expect } from 'vitest'
import { Config, MasterCSS } from '../../src'

test.concurrent('modes', () => {
    expect(new MasterCSS({
        variables: {
            fade: {
                '@light': '#cccccc',
                '@dark': '#333333',
                '@darker': '#222222'
            }
        },
        modes: { light: false }
    }).add('{block;fg:fade}_:where(p)_code:before').text).toBe('.dark{--fade:51 51 51}.\\{block\\;fg\\:fade\\}_\\:where\\(p\\)_code\\:before :where(p) code:before{display:block;color:rgb(var(--fade))}')
})

test.concurrent('media modes', () => {
    const config = { modes: { dark: 'media', light: 'media' } } as Config
    expect(new MasterCSS(config).add('bg:invert').text).toContain('@media(prefers-color-scheme:light){:root{--invert:0 0 0}}')
    expect(new MasterCSS(config).add('bg:invert').text).toContain('@media(prefers-color-scheme:dark){:root{--invert:255 255 255}}')
})

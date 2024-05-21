import { it, test, expect } from 'vitest'
import { MasterCSS } from '../src'

test('modes', () => {
    // expect(new MasterCSS({ ...config, modes: { light: 'media', dark: 'media' } }).add('fg:primary').text).toBe(':root{--primary:0 0 0}@media(prefers-color-scheme:light){:root{--primary:0 0 0}}@media(prefers-color-scheme:dark){:root{--primary:255 255 255}}.fg\\:primary{color:rgb(var(--primary))}',)
    // expect(new MasterCSS({
    //     variables: {
    //         fade: {
    //             '@light': '#cccccc',
    //             '@dark': '#333333'
    //         }
    //     },
    //     modes: { light: 'media', dark: 'media' }
    // }).add('{block;fg:fade}_:where(p)_code:before').text).toBe('@media(prefers-color-scheme:light){:root{--fade:204 204 204}}@media(prefers-color-scheme:dark){:root{--fade:51 51 51}}.\\{block\\;fg\\:fade\\}_\\:where\\(p\\)_code\\:before :where(p) code:before{display:block;color:rgb(var(--fade))}')
    // expect(new MasterCSS({ ...config, modes: { light: 'host', dark: 'host' } }).add('fg:primary')?.text).toBe(':root{--primary:0 0 0}:host(.light){--primary:0 0 0}:host(.dark){--primary:255 255 255}.fg\\:primary{color:rgb(var(--primary))}')
    // expect(new MasterCSS({
    //     variables: {
    //         fade: {
    //             '@light': '#cccccc',
    //             '@dark': '#333333'
    //         }
    //     },
    //     modes: { light: 'host', dark: 'host' }
    // }).add('{block;fg:fade}_:where(p)_code:before').text).toBe(':host(.light){--fade:204 204 204}:host(.dark){--fade:51 51 51}.\\{block\\;fg\\:fade\\}_\\:where\\(p\\)_code\\:before :where(p) code:before{display:block;color:rgb(var(--fade))}')
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


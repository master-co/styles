import { it, test, expect } from 'vitest'
import { MasterCSS } from '../../../src'

test.concurrent('modes and scale', () => {
    expect(new MasterCSS({
        variables: {
            primary: {
                10: '#eeeeee',
                20: '#dddddd',
                '@light': '#000000',
                '@dark': '#ffffff'
            }
        }
    })
        .add('fg:primary', 'fg:primary-10')
        .text
    )
        .toBe([
            '.light,:root{--primary:0 0 0}',
            '.dark{--primary:255 255 255}',
            '.fg\\:primary-10{color:rgb(238 238 238)}',
            '.fg\\:primary{color:rgb(var(--primary))}',
        ].join(''))
})
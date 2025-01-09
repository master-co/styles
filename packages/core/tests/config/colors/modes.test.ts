import { test } from 'vitest'
import { expectLayers } from '../../test'

test.concurrent('modes and scale', () => {
    expectLayers(
        {
            theme: '.light,:root{--primary:0 0 0}.dark{--primary:255 255 255}',
            general: '.fg\\:primary-10{color:rgb(238 238 238)}.fg\\:primary{color:rgb(var(--primary))}'
        },
        ['fg:primary', 'fg:primary-10'],
        {
            variables: {
                primary: {
                    10: '#eeeeee',
                    20: '#dddddd',
                    '@light': '#000000',
                    '@dark': '#ffffff'
                }
            }
        }
    )
})
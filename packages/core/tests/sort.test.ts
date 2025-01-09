import { it, test, expect } from 'vitest'
import { MasterCSS } from '../src'
import shuffle from 'shuffle-array'

/** [':disabled', ':active', ':focus', ':hover'] */
it.concurrent('checks the ordering of state selectors', () => {
    expect(new MasterCSS().add('block:disabled', 'block:hover', 'block:active', 'block:focus').generalLayer.rules)
        .toMatchObject([
            { name: 'block:hover' },
            { name: 'block:focus' },
            { name: 'block:active' },
            { name: 'block:disabled' }
        ])
})

it.concurrent('checks the ordering of state selectors, and @media', () => {
    const expected = [

        // normal
        { name: 'block' },

        // normal selector
        { name: 'block:hover' },
        { name: 'block:focus' },
        { name: 'block:active' },
        { name: 'block:disabled' },

        // @media
        { name: 'block@screen' },

        // @media selector
        { name: 'block:hover@screen' },
        { name: 'block:focus@print' },
        { name: 'block:active@screen' },
        { name: 'block:disabled@print' },

        // @media width
        { name: 'block@sm' },
        { name: 'block@md' },
        { name: 'block@>sm&<md' },

        // @media width selector
        { name: 'block:hover@sm' },
        { name: 'block:focus@sm' },
        { name: 'block:active@sm' },
        { name: 'block:disabled@sm' },

        { name: 'block:hover@md' },
        { name: 'block:focus@md' },
        { name: 'block:active@md' },
        { name: 'block:disabled@md' }
    ]

    for (let i = 0; i < 10; i++) {
        expect(new MasterCSS().add(...shuffle([...expected.map((({ name }) => name))])).generalLayer.rules)
            .toMatchObject(expected)
    }
})
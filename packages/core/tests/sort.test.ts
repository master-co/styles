import { it, test, expect } from 'vitest'
import { MasterCSS } from '../src'
import shuffle from 'shuffle-array'

/** [':disabled', ':active', ':focus', ':hover'] */
it.concurrent('checks the ordering of state selectors', () => {
    expect(new MasterCSS().add('block:disabled', 'block:hover', 'block:active', 'block:focus').utilityLayer.rules)
        .toMatchObject([
            { name: 'block:hover' },
            { name: 'block:focus' },
            { name: 'block:active' },
            { name: 'block:disabled' }
        ])
})

it.concurrent('checks the ordering of state selectors, :where(), and @media', () => {
    const expected = [
        // :where()
        { name: 'block:where(button)' },

        // normal
        { name: 'block' },

        // :where() selector
        { name: 'block:where(button):hover' },
        { name: 'block:where(button):focus' },
        { name: 'block:where(button):active' },
        { name: 'block:where(button):disabled' },

        // normal selector
        { name: 'block:hover' },
        { name: 'block:focus' },
        { name: 'block:active' },
        { name: 'block:disabled' },

        // @media :where()
        { name: 'block:where(button)@print' },

        // @media
        { name: 'block@screen' },

        // @media :where() selector
        { name: 'block:where(button):hover@screen' },
        { name: 'block:where(button):focus@print' },
        { name: 'block:where(button):active@screen' },
        { name: 'block:where(button):disabled@print' },

        // @media selector
        { name: 'block:hover@screen' },
        { name: 'block:focus@print' },
        { name: 'block:active@screen' },
        { name: 'block:disabled@print' },

        // @media width :where()
        // @media width
        { name: 'block:where(button)@sm' },
        { name: 'block@sm' },
        { name: 'block:where(button)@md' },
        { name: 'block@md' },
        { name: 'block:where(button)@>sm&<md' },
        { name: 'block@>sm&<md' },

        // @media width :where() selector
        // @media width selector
        { name: 'block:where(button):hover@sm' },
        { name: 'block:where(button):focus@sm' },
        { name: 'block:where(button):active@sm' },
        { name: 'block:where(button):disabled@sm' },
        { name: 'block:hover@sm' },
        { name: 'block:focus@sm' },
        { name: 'block:active@sm' },
        { name: 'block:disabled@sm' },
        { name: 'block:where(button):hover@md' },
        { name: 'block:where(button):focus@md' },
        { name: 'block:where(button):active@md' },
        { name: 'block:where(button):disabled@md' },
        { name: 'block:hover@md' },
        { name: 'block:focus@md' },
        { name: 'block:active@md' },
        { name: 'block:disabled@md' }
    ]

    for (let i = 0; i < 10; i++) {
        expect(new MasterCSS().add(...shuffle([...expected.map((({ name }) => name))])).utilityLayer.rules)
            .toMatchObject(expected)
    }
})
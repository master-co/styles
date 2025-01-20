import { it, test, expect } from 'vitest'
import { MasterCSS } from '../../src'

it.concurrent('validates border-width rules', () => {
    expect(new MasterCSS().create('b:16')?.text).toContain('border-width:1rem')
    expect(new MasterCSS().create('border:16')?.text).toContain('border-width:1rem')
    expect(new MasterCSS().create('border-width:16')?.text).toContain('border-width:1rem')

    expect(new MasterCSS().create('bb:16')?.text).toContain('border-bottom-width:1rem')
    expect(new MasterCSS().create('border-bottom:16')?.text).toContain('border-bottom-width:1rem')
    expect(new MasterCSS().create('border-bottom-width:16')?.text).toContain('border-bottom-width:1rem')

    expect(new MasterCSS().create('bt:16')?.text).toContain('border-top-width:1rem')
    expect(new MasterCSS().create('border-top:16')?.text).toContain('border-top-width:1rem')
    expect(new MasterCSS().create('border-top-width:16')?.text).toContain('border-top-width:1rem')

    expect(new MasterCSS().create('bl:16')?.text).toContain('border-left-width:1rem')
    expect(new MasterCSS().create('border-left:16')?.text).toContain('border-left-width:1rem')
    expect(new MasterCSS().create('border-left-width:16')?.text).toContain('border-left-width:1rem')

    expect(new MasterCSS().create('br:16')?.text).toContain('border-right-width:1rem')
    expect(new MasterCSS().create('border-right:16')?.text).toContain('border-right-width:1rem')
    expect(new MasterCSS().create('border-right-width:16')?.text).toContain('border-right-width:1rem')

    expect(new MasterCSS().create('bx:16')?.text).toContain('border-left-width:1rem;border-right-width:1rem')
    expect(new MasterCSS().create('border-x:16')?.text).toContain('border-left-width:1rem;border-right-width:1rem')
    expect(new MasterCSS().create('border-x-width:16')?.text).toContain('border-left-width:1rem;border-right-width:1rem')

    expect(new MasterCSS().create('border:16|solid')?.text).toContain('border:1rem solid')
})

it.concurrent('checks border-width order', () => {
    expect(new MasterCSS().add('bt:16', 'b:16', 'bl:16', 'bx:16').generalLayer.rules)
        .toMatchObject([
            { name: 'b:16' },
            { name: 'bx:16' },
            { name: 'bl:16' },
            { name: 'bt:16' }
        ])
})
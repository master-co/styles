import { hint } from './test'

test('screen size', () => expect(hint('hidden@')?.map(({ label }) => label)).toContain('@sm'))
test('&', () => expect(hint('hidden@sm&')?.map(({ label }) => label)).toContain('&sm'))
test('&>', () => expect(hint('hidden@sm&>')?.map(({ label }) => label)).toContain('>sm'))
test('&>=', () => expect(hint('hidden@sm&>=')?.map(({ label }) => label)).toContain('>=sm'))
test('&<', () => expect(hint('hidden@sm&<')?.map(({ label }) => label)).toContain('<sm'))
test('&<=', () => expect(hint('hidden@sm&<=')?.map(({ label }) => label)).toContain('<=sm'))

describe('sorting', () => {
    test('@', () => expect(hint('hidden@')?.map(({ label }) => label)).toEqual([
        '@4xs',
        '@3xs',
        '@2xs',
        '@xs',
        '@sm',
        '@md',
        '@lg',
        '@xl',
        '@2xl',
        '@3xl',
        '@4xl',
        '@all',
        '@landscape',
        '@media()',
        '@motion',
        '@portrait',
        '@print',
        '@reduced-motion',
        '@screen',
        '@speech',
        '@supports()',
    ]))
    test('@>', () => expect(hint('hidden@>')?.map(({ label }) => label)).toEqual([
        '>4xs',
        '>3xs',
        '>2xs',
        '>xs',
        '>sm',
        '>md',
        '>lg',
        '>xl',
        '>2xl',
        '>3xl',
        '>4xl'
    ]))
})
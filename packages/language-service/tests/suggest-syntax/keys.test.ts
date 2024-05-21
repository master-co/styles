import { test, it, expect, describe } from 'vitest'
import { hint } from './test'

it('should not hint selectors', () => expect(hint('text:')?.[0]).not.toMatchObject({ insertText: 'active' }))
test('@delay on invoked', () => expect(hint('')?.find(({ label }) => label === '@delay:')).toMatchObject({ label: '@delay:' }))
test('~delay on invoked', () => expect(hint('')?.find(({ label }) => label === '~delay:')).toMatchObject({ label: '~delay:' }))
it('starts with @', () => expect(hint('@')?.[0]).toMatchObject({ label: 'delay:' }))
it('starts with @d and list related', () => expect(hint('@d')?.map(({ label }) => label)).toEqual([
    'delay:',
    'direction:',
    'duration:'
]))
it('starts with @ and list related', () => expect(hint('@')?.map(({ label }) => label)).toEqual([
    'delay:',
    'direction:',
    'duration:',
    'easing:',
    'fade|1s',
    'fill:',
    'flash|1s',
    'float|1s',
    'heart|1s',
    'iteration:',
    'jump|1s',
    'name:',
    'ping|1s',
    'play:',
    'pulse|1s',
    'rotate|1s',
    'shake|1s',
    'zoom|1s',
]))
it('starts with ~', () => expect(hint('~')?.[0]).toMatchObject({ label: 'delay:' }))
it('starts with ~ and list related', () => expect(hint('~')?.map(({ label }) => label)).toEqual([
    'delay:',
    'duration:',
    'easing:',
    'property:'
]))
test('f', () => expect(hint('f')?.map(({ label }) => label)).toContain('font-size:'))
test('d', () => expect(hint('d')?.map(({ label }) => label)).toContain('display:'))

describe('ambiguous', () => {
    test('t', () => expect(hint('t')?.map(({ label }) => label)).toContain('t:'))
    test('t', () => expect(hint('t')?.map(({ label }) => label)).toContain('text:'))
})
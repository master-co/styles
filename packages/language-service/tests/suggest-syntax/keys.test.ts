import { test, it, expect, describe } from 'vitest'
import { hint } from './test'

it.concurrent('should not hint selectors', () => expect(hint('text:')?.[0]).not.toMatchObject({ insertText: 'active' }))
test.concurrent('@delay on invoked', () => expect(hint('')?.find(({ label }) => label === '@delay:')).toMatchObject({ label: '@delay:' }))
test.concurrent('~delay on invoked', () => expect(hint('')?.find(({ label }) => label === '~delay:')).toMatchObject({ label: '~delay:' }))
it.concurrent('starts with @', () => expect(hint('@')?.[0]).toMatchObject({ label: 'delay:' }))
it.concurrent('starts with @d and list related', () => expect(hint('@d')?.map(({ label }) => label)).toEqual([
    'delay:',
    'direction:',
    'duration:'
]))
it.concurrent('starts with @ and list related', () => expect(hint('@')?.map(({ label }) => label)).toEqual([
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
it.concurrent('starts with ~', () => expect(hint('~')?.[0]).toMatchObject({ label: 'delay:' }))
it.concurrent('starts with ~ and list related', () => expect(hint('~')?.map(({ label }) => label)).toEqual([
    'delay:',
    'duration:',
    'easing:',
    'property:'
]))
test.concurrent('f', () => expect(hint('f')?.map(({ label }) => label)).toContain('font-size:'))
test.concurrent('d', () => expect(hint('d')?.map(({ label }) => label)).toContain('display:'))

describe.concurrent('ambiguous', () => {
    test.concurrent('t', () => expect(hint('t')?.map(({ label }) => label)).toContain('t:'))
    test.concurrent('t', () => expect(hint('t')?.map(({ label }) => label)).toContain('text:'))
})
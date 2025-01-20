import { it, test, expect } from 'vitest'
import { MasterCSS } from '../../../src'

it.concurrent('should be able to access related font variables using inherited rules', () => {
    expect(Object.keys(new MasterCSS().definedRules.find(({ id }) => id === 'font')?.variables || {})).toEqual([
        'mono',
        'sans',
        'serif',
        'thin',
        '-thin',
        'extralight',
        '-extralight',
        'light',
        '-light',
        'regular',
        '-regular',
        'medium',
        '-medium',
        'semibold',
        '-semibold',
        'bold',
        '-bold',
        'extrabold',
        '-extrabold',
        'heavy',
        '-heavy',
    ])
})
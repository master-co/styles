import { it, test, expect } from 'vitest'
import { MasterCSS } from '../../../src'
import config from './master-css'

it.concurrent('config extends', () => {
    const css = new MasterCSS(config)
    expect(css.config.components).toMatchObject({
        'blue': {
            'btn': {
                '': 'btn bg:blue',
            },
        },
        'btn': {
            '': 'font:14 h:40 text:center'
        },
        'btn3': {
            '': 'font:15 h:90 text:center'
        },
        'btn4': {
            '': 'font:200'
        },
    })
    expect(css.variables.first).toMatchObject({
        name: 'first',
        key: 'first',
        type: 'color',
        space: 'rgb',
        value: '17 17 17',
        modes: {
            dark: {
                key: 'fourth',
                name: 'fourth',
                space: 'rgb',
                type: 'color',
                value: '0 0 0'
            },
            light: {
                key: 'fourth',
                name: 'fourth',
                space: 'rgb',
                type: 'color',
                value: '0 0 0'
            }
        }
    })
    expect(css.variables.second).toMatchObject({
        type: 'color',
        space: 'rgb',
        modes: {
            dark: {
                space: 'rgb',
                type: 'color',
                value: '0 0 0'
            },
            light: {
                space: 'rgb',
                type: 'color',
                value: '0 0 0 / .5'
            }
        }
    })
    expect(css.variables.third).toMatchObject({
        type: 'color',
        space: 'rgb',
        value: '0 0 0',
        modes: {
            dark: {
                space: 'rgb',
                type: 'color',
                value: '58 124 255'
            }
        }
    })
    expect(css.variables['third-2']).toMatchObject({
        type: 'color',
        space: 'rgb',
        modes: {
            dark: {
                space: 'rgb',
                type: 'color',
                value: '37 99 253'
            }
        }
    })
    expect(css.variables.fourth).toMatchObject({
        type: 'color',
        space: 'rgb',
        value: '17 17 17',
        modes: {
            dark: {
                space: 'rgb',
                type: 'color',
                value: '0 0 0'
            },
            light: {
                space: 'rgb',
                type: 'color',
                value: '0 0 0'
            }
        }
    })
})
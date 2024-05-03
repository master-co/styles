import { variables } from '../src'

test('declarations', () => {
    const css = new MasterCSS({
        variables: {
            primary: {
                '@light': '#fff',
                '@dark': '#000'
            }
        }
    })
    expect(css.generate('fg:primary')[0].declarations).toEqual({ color: 'rgb(var(--primary))' })
})

test('registered Rule', () => {
    expect(new MasterCSS().Rules.find(({ id }) => id === 'content')).toEqual({
        definition: {
            key: 'content',
            layer: -1
        },
        id: 'content',
        keys: ['content'],
        matchers: {
            key: /^content:/
        },
        order: 186,
        variables: {}
    })
})

test('variables', () => {
    const css = new MasterCSS({
        variables: {
            a: {
                1: 'test',
                b: {
                    2: 'test'
                }
            }
        },
        rules: {
            content: {
                variables: ['a.b']
            }
        }
    })
    expect(css.variables['a-1']).toMatchObject({ type: 'string', value: 'test', group: 'a' })
    expect(css.variables['a-b-2']).toMatchObject({ type: 'string', value: 'test', group: 'a.b' })
    expect(css.Rules.find(({ id }) => id === 'content')).toEqual({
        definition: {
            key: 'content',
            layer: -1,
            variables: ['a.b']
        },
        id: 'content',
        matchers: {
            key: /^content:/
        },
        keys: ['content'],
        order: 186,
        variables: {
            2: {
                key: '2',
                name: 'a-b-2',
                type: 'string',
                value: 'test',
                group: 'a.b'
            }
        }
    })
})

test('text variables', () => {
    expect(Object.keys(new MasterCSS().Rules.find(({ id }) => id === 'color')?.variables || {})).toEqual(Object.keys(variables.text))
})

describe('token', () => {
    test('value', () => {
        expect(new MasterCSS().generate('b:1|solid|blue-60:hover[disabled]@sm')[0].valueToken).toBe('1|solid|blue-60')
    })
    test('state', () => {
        expect(new MasterCSS().generate('b:1|solid|blue-60:hover[disabled]@sm')[0].stateToken).toBe(':hover[disabled]@sm')
    })
    test('at', () => {
        expect(new MasterCSS().generate('b:1|solid|blue-60:hover[disabled]@sm')[0].atToken).toBe('@sm')
    })
    test('empty at', () => {
        expect(new MasterCSS().generate('text:center@')[0].atToken).toBe('@')
    })
})

describe('value components', () => {
    test('basic', () => {
        const cls = 'font:32@sm'
        const rule = new MasterCSS().generate(cls)[0]
        expect(rule.valueComponents).toEqual([{
            text: '2rem',
            token: '32',
            type: 'number',
            value: 2,
            unit: 'rem'
        }])
        expect(rule.atToken).toBe('@sm')
    })

    test('shorthand', () => {
        expect(new MasterCSS().generate('b:1|solid|blue-60/.5')[0].valueComponents)
            .toStrictEqual([
                { token: '1', text: '0.0625rem', type: 'number', unit: 'rem', value: 0.0625 },
                { token: '|', text: ' ', type: 'separator', value: ' ' },
                { token: 'solid', text: 'solid', type: 'string', value: 'solid' },
                { token: '|', text: ' ', type: 'separator', value: ' ' },
                { token: 'blue-60/.5', alpha: '.5', name: 'blue-60', text: 'rgb(37 99 253/.5)', type: 'variable', variable: { space: 'rgb', type: 'color', value: '37 99 253', group: 'blue', key: '60', name: 'blue-60' } }
            ])
    })

    test('function', () => {
        expect(new MasterCSS().generate('bg:rgb(125,125,0)!')[0].valueComponents).toStrictEqual([
            {
                type: 'function',
                name: 'rgb',
                symbol: '(',
                children: [
                    { value: '125', type: 'string', token: '125', text: '125' },
                    { type: 'separator', value: ',', text: ',', token: ',' },
                    { value: '125', type: 'string', token: '125', text: '125' },
                    { type: 'separator', value: ',', text: ',', token: ',' },
                    { value: '0', type: 'string', token: '0', text: '0' }
                ],
                token: 'rgb(125,125,0)',
                text: 'rgb(125,125,0)'
            }
        ])
    })

    test('gradient', () => {
        expect(new MasterCSS().generate('gradient(#000,#fff)')[0].valueComponents).toStrictEqual([
            {
                text: 'gradient(#000,#fff)',
                token: 'gradient(#000,#fff)',
                type: 'function',
                name: 'gradient',
                symbol: '(',
                children: [
                    { value: '#000', type: 'string', token: '#000', text: '#000' },
                    { type: 'separator', value: ',', text: ',', token: ',' },
                    { value: '#fff', type: 'string', token: '#fff', text: '#fff' }
                ]
            }
        ])
    })
})
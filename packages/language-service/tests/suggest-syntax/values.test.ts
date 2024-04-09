import dedent from 'ts-dedent'
import { hint } from './test'
import { CompletionItemKind } from 'vscode-languageserver-protocol'

test.todo('convert any color spaces to RGB and hint correctly')

it('should ignore values containing blanks', () => expect(hint('font-family:')?.map(({ label }) => label)).not.toContain('Arial, Helvetica, sans-serif'))
it('types | delimiter', () => expect(hint('b:1|')?.map(({ label }) => label)).toContain('solid'))
it('types , separator', () => expect(hint('s:1|1|2|black,')?.map(({ label }) => label)).toContain('inset'))
it('ends with @ and not to hint values', () => expect(hint('text:center@')?.map(({ label }) => label)).not.toContain('center'))
it('ends with : and not to hint values', () => expect(hint('text:center:')?.map(({ label }) => label)).not.toContain('center'))

describe('scope variables', () => {
    test('font:semibold', () => expect(hint('font:')?.map(({ label }) => label)).toContain('semibold'))
    test('font:sans', () => expect(hint('font:')?.map(({ label }) => label)).toContain('semibold'))
    test('fg:blue', () => expect(hint('fg:')?.find(({ label }) => label === 'blue')).toEqual({
        'detail': '(scope) text-blue',
        'kind': 16,
        'label': 'blue',
        'sortText': 'aaaablue',
        'documentation': {
            'kind': 'markdown',
            'value': dedent`
                    \`\`\`css
                    .light {
                      --text-blue: 37 99 253
                    }
                    .dark {
                      --text-blue: 112 176 255
                    }
                    .fg\\:blue {
                      color: rgb(var(--text-blue))
                    }
                    \`\`\`

                    Sets the color of an element's text

                    (Edge 12, Firefox 1, Safari 1, Chrome 1, IE 3, Opera 3)

                    Syntax: &lt;color&gt;

                    [Master CSS](https://rc.css.master.co/docs/color) | [MDN Reference](https://developer.mozilla.org/docs/Web/CSS/color)
             `,
        }
    }))
    test('box:content', () => expect(hint('box:')?.find(({ label }) => label === 'content')).toEqual({
        'detail': '(scope) content-box',
        'kind': 12,
        'label': 'content',
        'sortText': 'aaaacontent',
        'documentation': {
            'kind': 'markdown',
            'value': dedent`
                    \`\`\`css
                    .box\\:content {
                      box-sizing: content-box
                    }
                    \`\`\`

                    Specifies the behavior of the 'width' and 'height' properties\\.

                    (Edge 12, Firefox 29, Safari 5, Chrome 10, IE 8, Opera 7)

                    Syntax: content\\-box | border\\-box

                    [Master CSS](https://rc.css.master.co/docs/box-sizing) | [MDN Reference](https://developer.mozilla.org/docs/Web/CSS/box-sizing)
                `}
    }))
})

describe('global variables', () => {
    test('fg:yellow-30', () => expect(hint('fg:')?.map(({ label }) => label)).toContain('yellow-30'))
})

test('scope variables conflicting with global variables', () => expect(hint('fg:')?.find(({ label }) => label === 'blue')).toEqual({
    'detail': '(scope) text-blue',
    'documentation': {
        'kind': 'markdown',
        'value': dedent`
                \`\`\`css
                .light {
                  --text-blue: 37 99 253
                }
                .dark {
                  --text-blue: 112 176 255
                }
                .fg\\:blue {
                  color: rgb(var(--text-blue))
                }
                \`\`\`

                Sets the color of an element's text

                (Edge 12, Firefox 1, Safari 1, Chrome 1, IE 3, Opera 3)

                Syntax: &lt;color&gt;

                [Master CSS](https://rc.css.master.co/docs/color) | [MDN Reference](https://developer.mozilla.org/docs/Web/CSS/color)`,
    },
    'kind': 16,
    'label': 'blue',
    'sortText': 'aaaablue',
}))

describe('ambiguous', () => {
    test('text:capitalize', () => expect(hint('text:')?.map(({ label }) => label)).toContain('capitalize'))
    test('text:center', () => expect(hint('text:')?.map(({ label }) => label)).toContain('center'))
})

describe('detail and documentation', () => {
    test('font:', () => expect(hint('font:')?.find(({ label }) => label === 'sans')).toEqual({
        detail: '(scope) ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji',
        kind: CompletionItemKind.Value,
        label: 'sans',
        sortText: 'aaaasans',
        documentation: {
            kind: 'markdown',
            value: dedent`
                    \`\`\`css
                    .font\\:sans {
                      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji
                    }
                    \`\`\`

                    Specifies a prioritized list of font family names or generic family names\\. A user agent iterates through the list of family names until it matches an available font that contains a glyph for the character to be rendered\\.

                    (Edge 12, Firefox 1, Safari 1, Chrome 1, IE 3, Opera 3)

                    Syntax: &lt;family\\-name&gt;

                    [Master CSS](https://rc.css.master.co/docs/font-family) | [MDN Reference](https://developer.mozilla.org/docs/Web/CSS/font-family)
                `
        }
    }))
    test('font-style:', () => expect(hint('font-style:')?.find(({ label }) => label === 'italic')).toEqual({
        detail: 'font-style: italic',
        kind: 12,
        label: 'italic',
        sortText: 'cccccitalic',
        documentation: {
            kind: 'markdown',
            value: dedent`
                    \`\`\`css
                    .font-style\\:italic {
                      font-style: italic
                    }
                    \`\`\`

                    Selects a font that is labeled as an 'italic' face, or an 'oblique' face if one is not

                    [Master CSS](https://rc.css.master.co/docs/font-style) | [MDN Reference](https://developer.mozilla.org/docs/Web/CSS/font-style)
                `
        }
    }))
})

describe('retype on no hints', () => {
    it('"text:c"', () => expect(hint('text:c')?.length).toBeGreaterThan(0))
    it('"d:b"', () => expect(hint('d:b')?.find(({ label }) => label === 'block')).toEqual({
        label: 'block',
        kind: 12,
        sortText: 'cccccblock',
        detail: 'display: block',
        documentation: {
            kind: 'markdown',
            value: dedent`
                    \`\`\`css
                    .d\\:block {
                      display: block
                    }
                    \`\`\`

                    The element generates a block\\-level box

                    [Master CSS](https://rc.css.master.co/docs/display) | [MDN Reference](https://developer.mozilla.org/docs/Web/CSS/display)
                `
        }
    }))
})

describe('negative values', () => {
    it('should hint negative values', () => expect(hint('font:')?.map(({ label }) => label)).not.toContain('-bold'))
    test.todo('types - to hint number values')
})

describe('sorting', () => {
    test('colors', () => {
        expect(
            hint('fg:')
                ?.filter(({ label }) => label.startsWith('yellow'))
                ?.map(({ label }) => label)
        ).toEqual([
            'yellow',
            'yellow-5',
            'yellow-10',
            'yellow-20',
            'yellow-30',
            'yellow-40',
            'yellow-50',
            'yellow-60',
            'yellow-70',
            'yellow-80',
            'yellow-90',
            'yellow-95',
        ])
    })
})

describe('functions', () => {
    test.todo('fucntions')
})
import dedent from 'ts-dedent'
import { hint } from './test'

it('types a', () => expect(hint('a')?.find(({ label }) => label === 'abs')).toMatchObject({ label: 'abs' }))
test('info', () => expect(hint('b')?.find(({ label }) => label === 'block')).toMatchObject({
    detail: 'display: block',
    documentation: {
        kind: 'markdown',
        value: dedent`
            \`\`\`css
            .block {
              display: block
            }
            \`\`\`

            The element generates a block\\-level box

            [Master CSS](https://rc.css.master.co/docs/display)
        `
    }
}))
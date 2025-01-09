import { test, it, expect, describe } from 'vitest'
import dedent from 'ts-dedent'
import { hint } from './test'

it.concurrent('types a', () => expect(hint('a')?.find(({ label }) => label === 'abs')).toMatchObject({ label: 'abs' }))
test.concurrent('info', () => expect(hint('b')?.find(({ label }) => label === 'block')).toMatchObject({
    detail: 'display: block',
    documentation: {
        kind: 'markdown',
        value: dedent`
            \`\`\`css
            @layer general {
              .block {
                display: block
              }
            }
            \`\`\`

            The element generates a block\\-level box

            [Master CSS](https://rc.css.master.co/reference/display)
        `
    }
}))
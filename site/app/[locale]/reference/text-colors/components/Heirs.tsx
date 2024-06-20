import { Fragment } from 'react'
import { syntaxes } from '@master/css'

export default () => <>
    {
        Object.keys(syntaxes)
            .filter((ruleName) => (syntaxes as any)[ruleName].variables?.find((variable: string) => variable.includes('text')))
            .map((ruleName, index, arr) =>
                <Fragment key={ruleName}>
                    <code>{ruleName}</code>
                    {index !== arr.length - 1 && ', '}
                </Fragment>
            )
    }
</>
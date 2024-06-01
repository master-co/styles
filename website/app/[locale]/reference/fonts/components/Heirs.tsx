import { Fragment } from 'react'
import { syntaxes } from '@master/css'

export default () => <>
    {
        Object.keys(syntaxes)
            .filter((ruleName) => (syntaxes as any)[ruleName].variables?.find((variable: string) => variable.includes('font-family')))
            .map((ruleName, index) =>
                <Fragment key={ruleName}>
                    <code key={ruleName}>{ruleName}</code>
                    {index !== 0 && ', '}
                </Fragment>
            )
    }
    , <code>font-family</code>
</>
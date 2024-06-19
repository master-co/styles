import { selectors } from '@master/css'
import InlineCode from 'internal/components/InlineCode'

export default () => <table>
    <thead>
        <tr>
            <th className="w:0">Name</th>
            <th>Replace with</th>
        </tr>
    </thead>
    <tbody>
        {
            Object.keys(selectors)
                .map((eachSelectorName) => {
                    // @ts-ignore
                    const eachSelector = selectors[eachSelectorName]
                    return (
                        <tr key={eachSelectorName}>
                            <td>
                                <code className="white-space:nowrap">{eachSelectorName}</code>
                            </td>
                            <td>
                                <InlineCode lang="js" beautify>{`
                                    ${JSON.stringify(eachSelector)}
                                `}</InlineCode>
                            </td>
                        </tr>
                    )
                })
        }
    </tbody>
</table>
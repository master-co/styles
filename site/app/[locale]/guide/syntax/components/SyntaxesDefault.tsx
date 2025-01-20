import { rules } from '@master/css'
import DotJoin from 'internal/components/DotJoin'
import InlineCode from '~/internal/components/InlineCode'

const Default = () => <table>
    <thead>
        <tr>
            <th className="w:0">Name</th>
            <th>Unit</th>
            <th>Variables</th>
        </tr>
    </thead>
    <tbody>
        {
            Object.keys(rules)
                .map((eachSyntaxName) => {
                    const eachSyntax = (rules as any)[eachSyntaxName]
                    return (
                        <tr key={eachSyntaxName}>
                            <td><code className='fg:blue white-space:nowrap'>{eachSyntaxName}</code></td>
                            <td>
                                {
                                    eachSyntax.unit
                                        ? <code className='fg:pink'>{eachSyntax.unit}</code>
                                        : <span className='fg:lightest'>-</span>
                                }
                            </td>
                            <td>
                                {eachSyntax.variables
                                    ? <InlineCode lang="ts" beautify>{JSON.stringify(eachSyntax.variables)}</InlineCode>
                                    : <span className='fg:lightest'>-</span>}
                            </td>
                        </tr>
                    )
                })
        }
    </tbody>
</table>

export default Default
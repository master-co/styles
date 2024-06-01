import { syntaxes } from '@master/css'
import DotJoin from 'internal/components/DotJoin'

const Default = () => <table>
    <thead>
        <tr>
            <th className="w:0">Rule</th>
            <th>Unit</th>
            <th>Values</th>
        </tr>
    </thead>
    <tbody>
        {
            Object.keys(syntaxes)
                .map((eachRuleName) => {
                    const eachRule = (syntaxes as any)[eachRuleName]
                    return (
                        <tr key={eachRuleName}>
                            <td><code className='fg:blue'>{eachRuleName}</code></td>
                            <td>
                                {
                                    eachRule.unit
                                        ? <code className='fg:pink'>{eachRule.unit}</code>
                                        : <span className='fg:lightest'>-</span>
                                }
                            </td>
                            <td>
                                {eachRule.variables
                                    ? (
                                        <code className='fg:inherit'>
                                            <DotJoin>{Object.keys(eachRule.variables).filter(x => Number.isNaN(+x))}</DotJoin>
                                        </code>
                                    )
                                    : <span className='fg:lightest'>-</span>}
                            </td>
                        </tr>
                    )
                })
        }
    </tbody>
</table>

export default Default
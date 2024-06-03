import { variables } from '@master/css'
import DocTable from 'internal/components/DocTable'
import descriptions from '../../../reference/screens/descriptions'

export default () =>
    <DocTable>
        <thead>
            <tr>
                <th>Token</th>
                <th>Size</th>
                <th>Devices</th>
            </tr>
        </thead>
        <tbody>
            {
                [
                    ...Object.keys(variables.screen)
                        .filter((eachBreakpointName) => typeof variables.screen[eachBreakpointName as keyof typeof variables.screen] === 'number')
                        .map((eachBreakpointName) => {
                            // @ts-ignore
                            const eachBreakpoint = variables.screen[eachBreakpointName]
                            return (
                                <tr key={eachBreakpointName}>
                                    <td><code>{eachBreakpointName}</code></td>
                                    <td>
                                        <code className='token number'>{eachBreakpoint}<span className='token unit'>px</span></code>
                                    </td>
                                    <td>
                                        {descriptions[eachBreakpointName as keyof typeof descriptions]}
                                    </td>
                                </tr>
                            )
                        })
                ]
            }
        </tbody>
    </DocTable>
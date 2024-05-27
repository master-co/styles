import { at } from '@master/css'
import DocTable from 'websites/components/DocTable'
import InlineCode from '../../../../../../../../components/InlineCode'

export default () =>
    <DocTable>
        <thead>
            <tr>
                <th>Token</th>
                <th>Value</th>
            </tr>
        </thead>
        <tbody>
            {
                [
                    ...Object.keys(at)
                        .map((eachBreakpointName) => {
                            // @ts-ignore
                            const eachBreakpoint = at[eachBreakpointName]
                            return (
                                <tr key={eachBreakpointName}>
                                    <td><code>{eachBreakpointName}</code></td>
                                    <td>
                                        <InlineCode lang="js">{JSON.stringify(eachBreakpoint)}</InlineCode>
                                    </td>
                                </tr>
                            )
                        })
                ]
            }
        </tbody>
    </DocTable>
import { queries } from '@master/css'
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
                    ...Object.keys(queries)
                        .map((eachBreakpointName) => {
                            // @ts-ignore
                            const eachBreakpoint = queries[eachBreakpointName]
                            return (
                                <tr key={eachBreakpointName}>
                                    <th><code>{eachBreakpointName}</code></th>
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
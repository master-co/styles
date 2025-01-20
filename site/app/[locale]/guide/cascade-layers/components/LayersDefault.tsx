import DocTable from 'internal/components/DocTable'
import InlineCode from 'internal/components/InlineCode'
import Link from 'internal/components/Link'

export default () => {
    return (
        <>
            <DocTable>
                <thead>
                    <tr>
                        <th className='w:0'>Layer</th>
                        <th>Description</th>
                        <th>Entity</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th>Base</th>
                        <td>Where the styles with <code>@base</code> are generated.</td>
                        <td className="white-space:nowrap"><InlineCode lang="css">{'@layer base { … }'}</InlineCode></td>
                    </tr>
                    <tr>
                        <th>Theme</th>
                        <td>Where the used <Link href="/guide/variables">variables</Link> are generated.</td>
                        <td className="white-space:nowrap"><InlineCode lang="css">{'@layer theme { … }'}</InlineCode></td>
                    </tr>
                    <tr>
                        <th>Preset</th>
                        <td>Where the styles with <code>@preset</code> are generated.</td>
                        <td className="white-space:nowrap"><InlineCode lang="css">{'@layer preset { … }'}</InlineCode></td>
                    </tr>
                    <tr>
                        <th>Components</th>
                        <td>Where the used <Link href="/guide/components">components</Link> are generated.</td>
                        <td className="white-space:nowrap"><InlineCode lang="css">{'@layer components { … }'}</InlineCode></td>
                    </tr>
                    <tr>
                        <th>General</th>
                        <td>Where the general styles are generated.</td>
                        <td className="white-space:nowrap"><InlineCode lang="css">{'@layer general { … }'}</InlineCode></td>
                    </tr>
                </tbody>
            </DocTable>
        </>
    )
}
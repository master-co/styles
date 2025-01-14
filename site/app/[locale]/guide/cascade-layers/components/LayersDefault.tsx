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
                        <td>Normalize and reset global styles.</td>
                        <td className="white-space:nowrap"><InlineCode lang="css">{'@layer base { … }'}</InlineCode></td>
                    </tr>
                    <tr>
                        <th>Theme</th>
                        <td>Where the <Link href="/guide/variables">variables</Link> are generated.</td>
                        <td className="white-space:nowrap"><InlineCode lang="css">{'@layer theme { … }'}</InlineCode></td>
                    </tr>
                    <tr>
                        <th>Preset</th>
                        <td>Where the <code>@preset</code> styles are generated.</td>
                        <td className="white-space:nowrap"><InlineCode lang="css">{'@layer preset { … }'}</InlineCode></td>
                    </tr>
                    <tr>
                        <th>Styles</th>
                        <td>Where the <Link href="/guide/styles">styles</Link> are generated.</td>
                        <td className="white-space:nowrap"><InlineCode lang="css">{'@layer styles { … }'}</InlineCode></td>
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
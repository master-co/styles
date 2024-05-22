import clsx from 'clsx'
import Link from 'websites/components/Link'
import { Page } from '~/script'

export default ({ children, className, url }: any) =>
    <div className={clsx(className, 'gap:4x grid-cols:2 grid-cols:4@sm mt:4x')}>{
        children.map((page: Page) =>
            <Link key={page.pathname}
                className={clsx(
                    'app-object app-object-interactive align-items:start! flex:col justify-content:start! p:5x|6x r:5 text:left',
                    {
                        'disabled': page.metadata?.disabled
                    }
                )}
                href={page.pathname}
                disabled={page.metadata?.disabled}
                rel="noreferrer noopener">
                <div className='text:18'>{((page.metadata.title as any)?.absolute || page.metadata.title) as string}</div>
                <div className='text:14 fg:light lines:2'>{page.metadata.description as string}</div>
            </Link>
        )
    }</div >
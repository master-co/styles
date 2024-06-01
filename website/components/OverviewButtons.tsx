import clsx from 'clsx'
import Link from 'internal/components/Link'
import { Page } from '~/website/script'

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
                <div className='font:16 leading:1.6 font:semibold'>{((page.metadata.title as any)?.absolute || page.metadata.title) as string}</div>
                <div className='fg:light lines:2 text:12 mt:1x'>{page.metadata.description as string}</div>
            </Link>
        )
    }</div >
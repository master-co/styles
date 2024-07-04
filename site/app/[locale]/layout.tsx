import RootLayout from 'internal/layouts/root'
import i18n from '~/internal/common/i18n.config.mjs'
import app from '~/site/app'
import redirects from '~/site/redirects.mjs'
import cssConfig from '~/site/master.css'

export default function Layout({ children, params }: {
    children: JSX.Element,
    params: { locale: typeof i18n.locales[number] }
}) {
    return (
        <RootLayout
            app={app}
            cssConfig={cssConfig}
            locale={params.locale}
            redirects={redirects}
        >
            {children}
        </RootLayout>
    )
}

if (process.env.NODE_ENV === 'development') {
    require('~/site/master.css')
}

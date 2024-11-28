import RootLayout from 'internal/layouts/root'
import i18n from '~/internal/common/i18n.config.mjs'
import app from '~/site/app'
import redirects from '~/site/redirects.mjs'
import cssConfig from '~/site/master.css'

export default async function Layout({ children, params }: {
    children: JSX.Element,
    params: Promise<{ locale: typeof i18n.locales[number] }>
}) {
    const { locale } = await params
    return (
        <RootLayout
            app={app}
            cssConfig={cssConfig}
            locale={locale}
            redirects={redirects}
        >
            {children}
        </RootLayout>
    )
}

if (process.env.NODE_ENV === 'development') {
    require('~/site/master.css')
}

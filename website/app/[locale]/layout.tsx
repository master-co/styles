import RootLayout from 'internal/layouts/root'
import i18n from '~/internal/common/i18n.config.mjs'
import { importTranslations } from '~/internal/utils/i18n'
import app from '~/website/app'
import redirects from '~/website/redirects.mjs'
import cssConfig from '~/website/master.css'

export { viewport } from 'internal/layouts/root'
export const metadata = {
    title: {
        template: '%s - Master CSS',
        default: 'Master CSS'
    },
    metadataBase: new URL(process.env.HOST as string)
}

export default function Layout({ children, params }: {
    children: JSX.Element,
    params: { locale: typeof i18n.locales[number] }
}) {
    return (
        <RootLayout
            app={app}
            cssConfig={cssConfig}
            locale={params.locale}
            translations={importTranslations(params.locale)}
            redirects={redirects}
        >
            {children}
        </RootLayout>
    )
}

if (process.env.NODE_ENV === 'development') {
    require('~/website/master.css')
}

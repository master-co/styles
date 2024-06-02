import { importTranslations } from 'internal/utils/i18n'
import RootLayout from 'internal/layouts/root'
import i18n from 'internal/common/i18n.config.mjs'
import project from '~/website/project'

export const metadata = {
    title: {
        template: '%s - Master CSS',
        default: 'Master CSS'
    }
}

export async function generateStaticParams() {
    return i18n.locales.map((locale: any) => ({ locale }))
}

export default async function Layout({ children, params }: {
    children: JSX.Element,
    params: { locale: typeof i18n.locales[number] }
}) {
    return (
        <RootLayout project={project} locale={params.locale} translations={await importTranslations(params.locale)}>{children}</RootLayout>
    )
}

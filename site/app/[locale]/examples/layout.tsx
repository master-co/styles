import { Body } from 'internal/layouts/root'
import i18n from 'internal/common/i18n.config.mjs'

export const metadata = {
    title: {
        template: '%s - Master CSS',
        default: 'Master CSS'
    }
}

export async function generateStaticParams() {
    return i18n.locales.map((locale: any) => ({ locale }))
}

export default async function Layout({ children }: {
    children: React.ReactElement
}) {
    return (
        <Body>
            {children}
        </Body>
    )
}
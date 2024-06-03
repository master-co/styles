import { Body } from 'internal/layouts/root'
import i18n from 'internal/common/i18n.config.mjs'
import DocHeader from 'internal/components/DocHeader'

export async function generateStaticParams() {
    return i18n.locales.map((locale: any) => ({ locale }))
}

export default async function Layout({ children }: {
    children: JSX.Element
}) {
    return (
        <Body className="bg:base">
            <DocHeader contained />
            {children}
        </Body>
    )
}

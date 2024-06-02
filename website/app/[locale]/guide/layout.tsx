import { importTranslations } from 'internal/utils/i18n'
import RootLayout, { Body } from 'internal/layouts/root'
import i18n from 'internal/common/i18n.config.mjs'
import DocHeader from 'internal/components/DocHeader'
import DocSidebar from 'internal/components/DocSidebar'
import guideCategories from '~/website/categories/guide.json'
import app from '~/website/app'

export async function generateStaticParams() {
    return i18n.locales.map((locale: any) => ({ locale }))
}

export default async function Layout({ children }: {
    children: JSX.Element
}) {
    return (
        <Body className="bg:base">
            <DocHeader contained />
            <DocSidebar pageCategories={guideCategories} />
            {children}
        </Body>
    )
}



import { Body } from 'internal/layouts/root'
import i18n from 'internal/common/i18n.config.mjs'
import DocHeader from 'internal/components/DocHeader'
import DocSidebar from 'internal/components/DocSidebar'
import { getUnitCategories } from '~/site/metadata'

export async function generateStaticParams() {
    return i18n.locales.map((locale: any) => ({ locale }))
}

const pageCategories = getUnitCategories('reference')

export default function Layout({ children }: {
    children: React.ReactElement
}) {
    return (
        <Body className="bg:base">
            <DocHeader contained />
            <DocSidebar pageCategories={pageCategories} />
            {children}
        </Body>
    )
}

import { Body } from 'internal/layouts/root'
import i18n from 'internal/common/i18n.config.mjs'
import DocHeader from 'internal/components/DocHeader'
import DocSidebar from 'internal/components/DocSidebar'
import referenceCategories from '~/website/categories/reference.json'

export const metadata = {
    title: {
        template: '%s - Master CSS',
        default: 'Master CSS'
    }
}

export async function generateStaticParams() {
    return i18n.locales.map((locale: any) => ({ locale }))
}

export default function Layout({ children }: {
    children: JSX.Element
}) {
    return (
        <Body className="bg:base">
            <DocHeader contained />
            <DocSidebar pageCategories={referenceCategories} />
            {children}
        </Body>
    )
}

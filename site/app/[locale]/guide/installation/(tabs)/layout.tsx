import Tabs, { Tab } from 'internal/components/Tabs'
import { createTranslation } from 'internal/utils/i18n'
import DocLayout from 'internal/layouts/doc'
import { getUnitCategories } from '~/site/metadata'
import metadata from './metadata'

const pageCategories = getUnitCategories('guide')

export default async function Layout(props: any) {
    const { locale } = await props.params
    const $ = createTranslation(locale)
    return (
        <DocLayout {...props} pageCategories={pageCategories} pageDirname={__dirname} metadata={metadata}>
            <Tabs className="mb:8x">
                <Tab href='/guide/installation'>{$('Guides')}</Tab>
                <Tab href='/guide/installation/cdn'>{$('CDN')}</Tab>
                <Tab href='/guide/installation/general'>{$('General')}</Tab>
                <Tab href='/guide/installation/download' disabled>{$('Download')}</Tab>
            </Tabs>
            {props.children}
        </DocLayout >
    )
}
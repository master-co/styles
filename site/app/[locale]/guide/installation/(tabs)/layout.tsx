import Tabs, { Tab } from 'internal/components/Tabs'
import { createTranslation } from 'internal/utils/i18n'
import DocLayout from 'internal/layouts/reference'
import { getUnitCategories } from '~/site/metadata'
import metadata from './metadata'

export default async function Layout(props: any) {
    const $ = await createTranslation(props.params.locale)
    return (
        <DocLayout {...props} pageCategories={getUnitCategories('guide')} pageDirname={__dirname} metadata={metadata}>
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
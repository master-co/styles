import Tabs, { Tab } from 'internal/components/Tabs'
import { createTranslation } from '~/website/i18n'
import DocLayout from 'internal/layouts/reference'
import pageCategories from '~/website/data/guide-categories.json'
import metadata from './metadata'

export default async function Layout(props: any) {
    const $ = await createTranslation(props.params.locale)
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
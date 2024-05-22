import Tabs, { Tab } from 'websites/components/Tabs'
import { createTranslation } from '~/i18n'
import DocLayout from '~/layouts/reference'
import metadata from './metadata'

export default async function Layout(props: any) {
    const $ = await createTranslation(props.params.locale)
    return (
        <DocLayout {...props} metadata={metadata}>
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
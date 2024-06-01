import Tabs, { Tab, TabBadge } from 'internal/components/Tabs'
import { createTranslation } from '~/website/i18n'
import DocLayout from '~/website/layouts/reference'
import brands from 'internal/data/brands'

export default async function Layout(props: any) {
    const $ = await createTranslation(props.params.locale)
    return (
        <DocLayout {...props}
            metadata={{
                title: 'Set up Master CSS in Nuxt.js',
                description: 'Guide to setting up Master CSS in your Nuxt.js project.',
                category: 'Installation'
            }}
            backOnClickCategory='/guide/installation'
            brand={brands.find(({ name }) => name === 'Nuxt.js')}

        >
            <Tabs className="mb:8x">
                <Tab href='/guide/installation/nuxtjs'>{$('Progressive Rendering')} <TabBadge>{$('Recommanded')}</TabBadge></Tab>
                <Tab href='/guide/installation/nuxtjs/runtime-rendering'>{$('Runtime Rendering')}</Tab>
                <Tab href='/guide/installation/nuxtjs/static-extraction'>{$('Static Extraction')}</Tab>
            </Tabs>
            {props.children}
        </DocLayout >
    )
}
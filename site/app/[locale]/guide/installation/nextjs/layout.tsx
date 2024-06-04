import Tabs, { Tab, TabBadge } from 'internal/components/Tabs'
import { createTranslation } from 'internal/utils/i18n'
import DocLayout from 'internal/layouts/reference'
import { getUnitCategories } from '~/site/metadata'
import brands from 'internal/data/brands'

export default async function Layout(props: any) {
    const $ = await createTranslation(props.params.locale)
    return (
        <DocLayout {...props}
            metadata={{
                title: 'Set up Master CSS in Next.js',
                description: 'Guide to setting up Master CSS in your Next.js project.',
                category: 'Installation'
            }}
            backOnClickCategory='/guide/installation'
            brand={brands.find(({ name }) => name === 'Next.js')}

        >
            <Tabs className="mb:8x">
                <Tab href='/guide/installation/nextjs'>{$('Progressive Rendering')} <TabBadge>{$('Recommanded')}</TabBadge></Tab>
                <Tab href='/guide/installation/nextjs/runtime-rendering'>{$('Runtime Rendering')}</Tab>
                <Tab href='/guide/installation/nextjs/static-extraction'>{$('Static Extraction')}</Tab>
            </Tabs>
            {props.children}
        </DocLayout >
    )
}
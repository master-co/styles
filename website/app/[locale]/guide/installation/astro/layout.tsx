import Tabs, { Tab, TabBadge } from 'internal/components/Tabs'
import { createTranslation } from '~/website/i18n'
import DocLayout from 'internal/layouts/reference'
import brands from 'internal/data/brands'

export default async function Layout(props: any) {
    const $ = await createTranslation(props.params.locale)
    return (
        <DocLayout {...props}
            metadata={{
                title: 'Set up Master CSS in Astro',
                description: 'Guide to setting up Master CSS in your Astro project.',
                category: 'Installation'
            }}
            backOnClickCategory='/guide/installation'
            brand={brands.find(({ name }) => name === 'Astro')}

        >
            <Tabs className="mb:8x">
                {/* <Tab href='/guide/installation/astro'>{$('Progressive Rendering')} <TabBadge>{$('Recommanded')}</TabBadge></Tab> */}
                <Tab href='/guide/installation/astro'>{$('Runtime Rendering')}</Tab>
                <Tab href='/guide/installation/astro/static-extraction'>{$('Static Extraction')}</Tab>
            </Tabs>
            {props.children}
        </DocLayout >
    )
}
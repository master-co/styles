import Tabs, { Tab, TabBadge } from 'internal/components/Tabs'
import { createTranslation } from '~/i18n'
import DocLayout from '~/layouts/reference'
import brands from 'internal/data/brands'

export const metadata = {
    title: 'Set up Master CSS in Svelte',
    description: 'Guide to setting up Master CSS in your Svelte project.',
    category: 'Installation'
}

export default async function Layout(props: any) {
    const $ = await createTranslation(props.params.locale)
    return (
        <DocLayout {...props}
            metadata={metadata}
            backOnClickCategory='/guide/installation'
            brand={brands.find(({ name }) => name === 'Svelte')}

        >
            <Tabs className="mb:8x">
                <Tab href='/guide/installation/svelte'>{$('Progressive Rendering')} <TabBadge>{$('Recommanded')}</TabBadge></Tab>
                <Tab href='/guide/installation/svelte/runtime-rendering'>{$('Runtime Rendering')}</Tab>
                <Tab href='/guide/installation/svelte/static-extraction'>{$('Static Extraction')}</Tab>
            </Tabs>
            {props.children}
        </DocLayout >
    )
}
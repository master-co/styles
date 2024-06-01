import Tabs, { Tab, TabBadge } from 'internal/components/Tabs'
import { createTranslation } from '~/website/i18n'
import DocLayout from '~/website/layouts/reference'
import brands from 'internal/data/brands'

export default async function Layout(props: any) {
    const $ = await createTranslation(props.params.locale)
    return (
        <DocLayout {...props}
            metadata={{
                title: 'Set up Master CSS in Blazor',
                description: 'Guide to setting up Master CSS in your Blazor project.',
                category: 'Installation'
            }}
            backOnClickCategory='/guide/installation'
            brand={brands.find(({ name }) => name === 'Blazor')}

        >
            <Tabs className="mb:8x">
                <Tab href='/guide/installation/blazor'>{$('Runtime Rendering')}</Tab>
                <Tab href='/guide/installation/blazor/static-extraction' disabled>{$('Static Extraction')}</Tab>
            </Tabs>
            {props.children}
        </DocLayout >
    )
}
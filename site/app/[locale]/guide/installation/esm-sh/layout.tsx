import { createTranslation } from 'internal/utils/i18n'
import DocLayout from 'internal/layouts/doc'
import metadata from './metadata'
import brands from 'internal/data/brands'

export default async function Layout(props: any) {
    const $ = await createTranslation(props.params.locale)
    return (
        <DocLayout {...props}
            metadata={{
                title: 'Launch Master CSS using esm.sh',
                description: metadata.description,
                category: metadata.category
            }}
            backOnClickCategory='/guide/installation'
            brand={brands.find(({ name }) => name === 'esm.sh')}

        >
            {props.children}
        </DocLayout >
    )
}
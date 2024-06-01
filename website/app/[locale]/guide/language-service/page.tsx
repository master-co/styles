import DocLayout from '~/website/layouts/reference'
import pageCategories from '~/website/data/guide-categories.json'
import Content from './content.mdx'
import metadata from './metadata'
import { createTranslation } from '~/website/i18n'
import { generate } from '~/website/utils/metadata'

export const dynamic = 'force-static'
export const revalidate = false

export async function generateMetadata(props: any, parent: any) {
    return await generate(metadata, props, parent)
}

export default async function Layout(props: any) {
    const $ = await createTranslation(props.params.locale)
    return (
        <DocLayout {...props} pageCategories={pageCategories} pageDirname={__dirname} metadata={metadata}>
            <Content />
        </DocLayout >
    )
}
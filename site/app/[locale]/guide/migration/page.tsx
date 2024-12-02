import metadata from './metadata'
import Content from './content.mdx'
import generate from 'internal/utils/generate-metadata'
import { createTranslation } from 'internal/utils/i18n'
import DocLayout from 'internal/layouts/doc'
import { getUnitCategories } from '~/site/metadata'

export const dynamic = 'force-static'
export const revalidate = false

export async function generateMetadata(props: any, parent: any) {
    return await generate(metadata, props, parent)
}

export default async function Layout(props: any) {
    const { locale } = await props.params
    const $ = createTranslation(locale)
    return (
        <DocLayout {...props} pageCategories={getUnitCategories('guide')} pageDirname={__dirname} metadata={metadata}>
            <Content />
        </DocLayout >
    )
}
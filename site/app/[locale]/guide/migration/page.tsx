import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import metadata from './metadata'
import Content from './content.mdx'
import generate from 'internal/utils/generate-metadata'
import { createTranslation } from 'internal/utils/i18n'
import DocLayout from 'internal/layouts/doc'

export const dynamic = 'force-static'
export const revalidate = false

export async function generateMetadata(props: any, parent: any) {
    return await generate(metadata, props, parent)
}

import pageCategories from '~/site/.categories/guide.json'

export default async function Layout(props: any) {
    const { locale } = await props.params
    const $ = createTranslation(locale)
    return (
        <DocLayout {...props} pageCategories={pageCategories} pageDirname={dirname(fileURLToPath(import.meta.url))} metadata={metadata}>
            <Content />
        </DocLayout >
    )
}
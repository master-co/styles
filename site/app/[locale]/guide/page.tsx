import Layout from 'internal/layouts/doc'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import metadata from './metadata'
import Content from './content.mdx'
import generate from 'internal/utils/generate-metadata'

export const dynamic = 'force-static'
export const revalidate = false

export async function generateMetadata(props: any, parent: any) {
    return await generate(metadata, props, parent)
}

import pageCategories from '~/site/.categories/guide.json'

export default async function Page(props: any) {
    return (
        <Layout {...props} pageCategories={pageCategories} pageDirname={dirname(fileURLToPath(import.meta.url))} metadata={metadata}>
            <Content pageCategories={pageCategories} />
        </Layout >
    )
}
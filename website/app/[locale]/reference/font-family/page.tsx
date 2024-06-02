import Layout from 'internal/layouts/reference'
import pageCategories from '~/website/data/reference-categories.json'
import metadata from './metadata'
/* @ts-expect-error toc */
import Content, { toc } from './content.mdx'
import { generate } from '~/website/utils/metadata'

export const dynamic = 'force-static'
export const revalidate = false

export async function generateMetadata(props: any, parent: any) {
    return await generate(metadata, props, parent)
}

export default async function Page(props: any) {
    return (
        <Layout {...props} pageCategories={pageCategories} pageDirname={__dirname} metadata={metadata} toc={toc}>
            <Content />
        </Layout >
    )
}
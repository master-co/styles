import metadata from './metadata'
import Content from './content.mdx'
import { generate } from '~/utils/metadata'
import Layout from '~/layouts/reference'
import pageCategories from '~/data/guide-categories.json'
import ESLintSvg from '~/public/icons/eslint.svg?inlineSvg'

export const dynamic = 'force-static'
export const revalidate = false

export async function generateMetadata(props: any, parent: any) {
    return await generate(metadata, props, parent)
}

export default async function Page(props: any) {
    return (
        <Layout {...props} pageCategories={pageCategories} pageDirname={__dirname} metadata={metadata} icon={<ESLintSvg width={90} />}>
            <Content />
        </Layout >
    )
}
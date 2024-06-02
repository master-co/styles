import Layout from 'internal/layouts/reference'
import pageCategories from '~/website/categories/guide.json'
import metadata from './metadata'
import Content from './content.mdx'
import { generate } from 'internal/utils/metadata'
import LogoSvg from '~/website/public/images/frameworks/laravel.svg?inlineSvg'

export const dynamic = 'force-static'
export const revalidate = false

export async function generateMetadata(props: any, parent: any) {
    return await generate(metadata, props, parent)
}

export default async function Page(props: any) {
    return (
        <Layout {...props} pageCategories={pageCategories} pageDirname={__dirname}
            metadata={metadata}

            backOnClickCategory='/guide/code-linting'
            icon={<LogoSvg width={72} />}
        >
            <Content />
        </Layout >
    )
}
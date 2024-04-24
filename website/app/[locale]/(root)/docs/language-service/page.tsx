import DocLayout from '~/layouts/reference'
import Content from './content.mdx'
import metadata from './metadata'
import { createTranslation } from '~/i18n'

export default async function Layout(props: any) {
    const $ = await createTranslation(props.params.locale)
    return (
        <DocLayout {...props} metadata={metadata}>
            <Content />
        </DocLayout >
    )
}
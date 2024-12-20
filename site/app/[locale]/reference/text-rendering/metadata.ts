import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Text Rendering',
    description: 'Setting what to optimize when rendering text.',
    category: 'Syntax',
    unfinished: true,
    canIUseLink: 'https://caniuse.com/?search=text-rendering',
    mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/CSS/text-rendering',
    filename: fileURLToPath(import.meta.url)
})

export default metadata
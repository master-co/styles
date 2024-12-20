import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Shape Margin',
    description: 'Setting a margin for a CSS shape.',
    category: 'Syntax',
    unfinished: true,
    canIUseLink: 'https://caniuse.com/?search=shape-margin',
    mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/CSS/shape-margin',
    filename: fileURLToPath(import.meta.url)
})

export default metadata
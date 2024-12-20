import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Shape Outside',
    description: 'Setting a shape around which adjacent inline content should wrap.',
    category: 'Syntax',
    unfinished: true,
    canIUseLink: 'https://caniuse.com/?search=shape-outside',
    mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/CSS/shape-outside',
    filename: fileURLToPath(import.meta.url)
})

export default metadata
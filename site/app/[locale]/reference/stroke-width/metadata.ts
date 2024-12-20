import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Stroke Width',
    description: 'Setting the width of the stroke to be applied to the SVG shape.',
    category: 'Syntax',
    unfinished: true,
    canIUseLink: 'https://caniuse.com/?search=background',
    mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-width',
    filename: fileURLToPath(import.meta.url)
})

export default metadata
import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Shape Image Threshold',
    description: 'Setting the alpha channel threshold for a CSS shape.',
    category: 'Syntax',
    unfinished: true,
    canIUseLink: 'https://caniuse.com/?search=shape-image-threshold',
    mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/CSS/shape-image-threshold',
    filename: fileURLToPath(import.meta.url)
})

export default metadata
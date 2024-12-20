import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Z Index',
    description: 'Set the z-order of a positioned element.',
    category: 'Syntax',
    unfinished: true,
    canIUseLink: 'https://caniuse.com/?search=z-index',
    mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/CSS/z-index',
    filename: fileURLToPath(import.meta.url)
})

export default metadata
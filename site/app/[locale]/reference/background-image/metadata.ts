import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Background Image',
    description: 'Setting background images on an element.',
    category: 'Syntax',
    unfinished: true,
    canIUseLink: 'https://caniuse.com/?search=background-image',
    mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/CSS/background-image',
    filename: fileURLToPath(import.meta.url)
})

export default metadata
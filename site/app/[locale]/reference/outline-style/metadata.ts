import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Outline Style',
    description: 'Setting the style of an element\'s outline.',
    category: 'Syntax',
    unfinished: true,
    canIUseLink: 'https://caniuse.com/?search=outline-style',
    mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/CSS/outline-style',
    filename: fileURLToPath(import.meta.url)
})

export default metadata
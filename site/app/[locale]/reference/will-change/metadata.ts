import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Will Change',
    description: 'Setting how an element is expected to change in the browser.',
    category: 'Syntax',
    unfinished: true,
    canIUseLink: 'https://caniuse.com/?search=will-change',
    mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/CSS/will-change',
    filename: fileURLToPath(import.meta.url)
})

export default metadata
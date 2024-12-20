import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'List Style',
    description: 'Setting all the list style properties at once.',
    category: 'Syntax',
    unfinished: true,
    canIUseLink: 'https://caniuse.com/?search=list-style',
    mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/CSS/list-style',
    filename: fileURLToPath(import.meta.url)
})

export default metadata
import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Filter',
    description: 'Applying graphic effects to an element.',
    category: 'Syntax',
    unfinished: true,
    canIUseLink: 'https://caniuse.com/?search=filter',
    mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/CSS/filter',
    filename: fileURLToPath(import.meta.url)
})

export default metadata
import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Grid Template',
    description: 'Setting grid columns, grid rows, and grid areas.',
    category: 'Syntax',
    unfinished: true,
    canIUseLink: 'https://caniuse.com/?search=grid-template',
    mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template',
    filename: fileURLToPath(import.meta.url)
})

export default metadata
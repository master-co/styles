import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Grid Columns',
    description: 'Style utility for creating multiple grid columns.',
    category: 'Syntax',
    unfinished: true,
    canIUseLink: 'https://caniuse.com/?search=grid-template-columns',
    mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-columns',
    filename: fileURLToPath(import.meta.url)
})

export default metadata
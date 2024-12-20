import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Grid Rows',
    description: 'Style utility for creating multiple grid rows.',
    category: 'Syntax',
    unfinished: true,
    canIUseLink: 'https://caniuse.com/?search=grid-template-rows',
    mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-rows',
    filename: fileURLToPath(import.meta.url)
})

export default metadata
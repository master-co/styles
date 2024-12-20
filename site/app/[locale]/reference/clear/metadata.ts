import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Clear',
    description: 'Moving an element below floating elements instead of floating to the left or right.',
    category: 'Syntax',
    unfinished: true,
    canIUseLink: 'https://caniuse.com/?search=clear',
    mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/CSS/clear',
    filename: fileURLToPath(import.meta.url)
})

export default metadata
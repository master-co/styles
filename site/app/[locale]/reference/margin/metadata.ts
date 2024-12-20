import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Margin',
    description: 'Setting the margin area on all four sides of an element.',
    category: 'Syntax',
    unfinished: true,
    canIUseLink: 'https://caniuse.com/?search=margin',
    mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/CSS/margin',
    filename: fileURLToPath(import.meta.url)
})

export default metadata
import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Font Family',
    description: 'Setting the font for an element.',
    category: 'Syntax',
    canIUseLink: 'https://caniuse.com/?search=font-family',
    mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/CSS/font-family',
    filename: fileURLToPath(import.meta.url)
})

export default metadata
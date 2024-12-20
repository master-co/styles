import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Box Shadow',
    description: 'Adding shadow effects around an element.',
    category: 'Syntax',
    unfinished: true,
    canIUseLink: 'https://caniuse.com/?search=box-shadow',
    mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow',
    filename: fileURLToPath(import.meta.url)
})

export default metadata
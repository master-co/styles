import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Max Height',
    description: 'Setting the maximum height of an element.',
    category: 'Syntax',
    unfinished: true,
    canIUseLink: 'https://caniuse.com/?search=max-height',
    mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/CSS/max-height',
    filename: fileURLToPath(import.meta.url)
})

export default metadata
import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Background Color',
    description: 'Setting the background color of an element.',
    category: 'Syntax',
    canIUseLink: 'https://caniuse.com/?search=background-color',
    mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/CSS/background-color',
    filename: fileURLToPath(import.meta.url)
})

export default metadata
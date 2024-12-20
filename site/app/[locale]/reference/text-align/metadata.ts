import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Text Align',
    description: 'Setting the text alignment of an element.',
    category: 'Syntax',
    unfinished: true,
    canIUseLink: 'https://caniuse.com/?search=text-align',
    mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/CSS/text-align',
    filename: fileURLToPath(import.meta.url)
})

export default metadata
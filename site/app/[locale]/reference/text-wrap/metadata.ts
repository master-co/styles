import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Text Wrap',
    description: 'Controlling how text inside an element is wrapped.',
    category: 'Syntax',
    unfinished: true,
    canIUseLink: 'https://caniuse.com/?search=text-wrap',
    mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/CSS/text-wrap',
    filename: fileURLToPath(import.meta.url)
})

export default metadata
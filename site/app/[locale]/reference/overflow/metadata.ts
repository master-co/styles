import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Overflow',
    description: 'Controlling the desired behavior for an element\'s overflow.',
    category: 'Syntax',
    unfinished: true,
    canIUseLink: 'https://caniuse.com/?search=overflow',
    mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/CSS/overflow',
    filename: fileURLToPath(import.meta.url)
})

export default metadata
import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Flex',
    description: 'Setting how flex items grow or shrink.',
    category: 'Syntax',
    unfinished: true,
    canIUseLink: 'https://caniuse.com/?search=flex',
    mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/CSS/flex',
    filename: fileURLToPath(import.meta.url)
})

export default metadata
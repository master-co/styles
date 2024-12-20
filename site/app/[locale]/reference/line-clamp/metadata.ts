import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Line Clamp',
    description: 'Limiting the contents of a container to the specified number of lines.',
    category: 'Syntax',
    unfinished: true,
    canIUseLink: 'https://caniuse.com/?search=line-clamp',
    mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/CSS/line-clamp',
    filename: fileURLToPath(import.meta.url)
})

export default metadata
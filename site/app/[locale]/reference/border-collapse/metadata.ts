import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Border Collapse',
    description: 'Setting whether table cell have shared or separate borders.',
    category: 'Syntax',
    unfinished: true,
    canIUseLink: 'https://caniuse.com/?search=border-collapse',
    mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/CSS/border-collapse',
    filename: fileURLToPath(import.meta.url)
})

export default metadata
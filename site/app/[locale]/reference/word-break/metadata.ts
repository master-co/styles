import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Word Break',
    description: 'Setting whether words should break.',
    category: 'Syntax',
    unfinished: true,
    canIUseLink: 'https://caniuse.com/?search=word-break',
    mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/CSS/word-break',
    filename: fileURLToPath(import.meta.url)
})

export default metadata
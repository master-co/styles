import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Writing Mode',
    description: 'Setting different writing mode.',
    category: 'Syntax',
    unfinished: true,
    canIUseLink: 'https://caniuse.com/?search=writing-mode',
    mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/CSS/writing-mode',
    filename: fileURLToPath(import.meta.url)
})

export default metadata
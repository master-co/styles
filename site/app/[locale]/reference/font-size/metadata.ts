import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Font Size',
    description: 'Setting the font size of elements.',
    category: 'Syntax',
    unfinished: true,
    canIUseLink: 'https://caniuse.com/?search=font-size',
    mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/CSS/font-size',
    filename: fileURLToPath(import.meta.url)
})

export default metadata
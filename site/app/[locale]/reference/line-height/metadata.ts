import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Line Height',
    description: 'Setting the height of a line box.',
    category: 'Syntax',
    unfinished: true,
    canIUseLink: 'https://caniuse.com/?search=line-height',
    mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/CSS/line-height',
    filename: fileURLToPath(import.meta.url)
})

export default metadata
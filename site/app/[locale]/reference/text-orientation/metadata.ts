import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Text Orientation',
    description: 'Setting orientation of the text characters in a line.',
    category: 'Syntax',
    unfinished: true,
    canIUseLink: 'https://caniuse.com/?search=text-orientation',
    mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/CSS/text-orientation',
    filename: fileURLToPath(import.meta.url)
})

export default metadata
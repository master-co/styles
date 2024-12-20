import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Mix Blend Mode',
    description: 'Setting how an element\'s content should blend with its parent background.',
    category: 'Syntax',
    unfinished: true,
    canIUseLink: 'https://caniuse.com/?search=mix-blend-mode',
    mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/CSS/mix-blend-mode',
    filename: fileURLToPath(import.meta.url)
})

export default metadata
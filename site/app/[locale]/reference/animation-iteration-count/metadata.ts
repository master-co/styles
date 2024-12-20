import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Animation Iteration Count',
    description: 'Setting the number of times an animation should be played.',
    category: 'Syntax',
    canIUseLink: 'https://caniuse.com/?search=animation-iteration-count',
    mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/CSS/animation-iteration-count',
    filename: fileURLToPath(import.meta.url)
})

export default metadata
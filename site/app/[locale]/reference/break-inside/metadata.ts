import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Break Inside',
    description: 'Controlling how page, column, or region breaks should occur within the specified element.',
    category: 'Syntax',
    unfinished: true,
    canIUseLink: 'https://caniuse.com/?search=break-inside',
    mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/CSS/break-inside',
    filename: fileURLToPath(import.meta.url)
})

export default metadata
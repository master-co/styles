import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Blog',
    description: 'The latest Master CSS things',
    unfinished: true,
    filename: fileURLToPath(import.meta.url)
})

export default metadata
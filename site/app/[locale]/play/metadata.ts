import { fileURLToPath } from 'url'
import define from '~/internal/utils/metadata'

const metadata= define({
    title: 'Play',
    description: 'A real-time code editor for Master CSS.',
    category: `v${process.env.NEXT_PUBLIC_VERSION}`,
    openGraph: {
        title: 'Playground'
    },
    filename: fileURLToPath(import.meta.url)
})

export default metadata
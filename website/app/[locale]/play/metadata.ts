import { Metadata } from 'internal/types/Metadata'
import version from '~/website/app/version'

const metadata: Metadata = {
    title: 'Play',
    description: 'A real-time code editor for Master CSS.',
    category: `v${version}`,
    openGraph: {
        title: 'Playground'
    }
}

export default metadata
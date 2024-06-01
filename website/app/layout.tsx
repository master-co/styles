import { Viewport } from 'next'

if (process.env.NODE_ENV === 'development') {
    require('~/website/master.css')
}

export const metadata = {
    title: {
        template: '%s - Master CSS',
        default: 'Master CSS'
    },
    metadataBase: new URL(process.env.HOST as string)
}

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover'
}

export default async function RootLayout({ children }: {
    children: JSX.Element
}) {
    return children
}

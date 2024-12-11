if (process.env.NODE_ENV === 'development') {
    require('~/site/master.css')
}

export { viewport } from 'internal/layouts/root'

export const metadata = {
    title: {
        template: `%s - ${process.env.NEXT_PUBLIC_PROJECT}`,
        default: process.env.NEXT_PUBLIC_PROJECT
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_URL as string)
}

export default async function RootLayout({ children }: {
    children: React.ReactElement
}) {
    return children
}

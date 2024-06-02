if (process.env.NODE_ENV === 'development') {
    require('~/website/master.css')
}

export { viewport } from 'internal/layouts/root'

export const metadata = {
    title: {
        template: '%s - Master CSS',
        default: 'Master CSS'
    },
    metadataBase: new URL(process.env.HOST as string)
}

export default async function RootLayout({ children }: {
    children: JSX.Element
}) {
    return children
}

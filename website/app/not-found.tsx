import NotFoundLayout from 'internal/layouts/not-found'
import app from '.'

export default async function NotFound() {
    return (
        <NotFoundLayout app={app} />
    )
}

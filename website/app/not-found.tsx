import NotFoundLayout from 'internal/layouts/not-found'
import project from '../project'

export default async function NotFound() {
    return (
        <NotFoundLayout project={project} />
    )
}

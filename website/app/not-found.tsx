import NotFoundLayout from 'internal/layouts/not-found'
import app from '.'
import config from '~/website/master.css'
import redirects from '../redirects.mjs'

export default async function NotFound() {
    return (
        <NotFoundLayout app={app} cssConfig={config} redirects={redirects}/>
    )
}

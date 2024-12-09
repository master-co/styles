import { render } from '@master/css-server'
import type { Handle } from '@sveltejs/kit'

const handle: Handle = async ({ event, resolve }) => {
    return await resolve(event, {
        transformPageChunk: ({ html }) => render(html).html
    })
}

export default handle
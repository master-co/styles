import { commonRedirects } from '~/internal/next.config.mjs'

const redirects = []

export default resolve(
    [
        commonRedirects,
        ...redirects
    ]
)
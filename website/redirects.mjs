import i18n from 'internal/i18n.config.mjs'

const generateRedirect = (source, dest) => ([
    { source: source, destination: dest, permanent: false },
    { source: source + '/:path*', destination: dest + '/:path*', permanent: false },
])

const redirects = [
    // { source: '/sandbox', destination: '/play', permanent: false },
    // { source: '/sandbox/:path*', destination: '/play/:path*', permanent: false },
    // { source: '/docs', destination: '/guide', permanent: false },
    // ...generateRedirect('/docs/installation', '/guide/installation'),
    // ...generateRedirect('/docs/language-service', '/guide/language-service'),
    // ...generateRedirect('/docs/code-linting', '/guide/code-linting'),
    // ...generateRedirect('/docs/migration', '/guide/migration'),
    // ...generateRedirect('/docs/style-declarations', '/guide/style-declarations'),
    // ...generateRedirect('/docs/state-selectors', '/guide/state-selectors'),
    // ...generateRedirect('/docs/rendering-modes', '/guide/rendering-modes'),
    // ...generateRedirect('/docs/markup-driven', '/guide/markup-driven'),
    // ...generateRedirect('/docs/global-styles', '/guide/global-styles'),
    // ...generateRedirect('/docs/browser-support', '/guide/browser-support'),
    // ...generateRedirect('/docs/responsive-design', '/guide/responsive-design'),
    // ...generateRedirect('/docs/reusing-styles', '/guide/reusing-styles'),
    // ...generateRedirect('/docs/variables-and-modes', '/guide/variables-and-modes'),
    // ...generateRedirect('/docs/dynamic-application', '/guide/dynamic-application'),
    // ...generateRedirect('/docs/flash-of-unstyled-content', '/guide/flash-of-unstyled-content'),
    // ...generateRedirect('/docs/lazy-loading', '/guide/lazy-loading'),
    // ...generateRedirect('/docs/minimization', '/guide/minimization'),
    // ...generateRedirect('/docs/preload-critical-resources', '/guide/preload-critical-resources'),
]

export default [
    { source: `/${i18n.defaultLocale}/:path((?!.*opengraph-image).*)`, destination: '/:path*', permanent: true },
    ...redirects,
    ...redirects
        .map((eachRedirect) => {
            return i18n.locales
                .filter((locale) => locale !== 'en')
                .map((locale) => {
                    return {
                        ...eachRedirect,
                        source: `/${locale}${eachRedirect.source}`,
                        destination: `/${locale}${eachRedirect.destination}`,
                    }
                })
                .flat()
        })
        .flat()
]
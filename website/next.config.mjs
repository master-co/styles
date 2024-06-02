import redirects from './redirects.mjs'
import CopyPlugin from 'copy-webpack-plugin'
import path from 'path'
import withWebpackConfig from 'internal/with-webpack-config.mjs'
import common from 'internal/common/next.config.mjs'
import commonHeaders from 'internal/common/headers.mjs'
import commonRewrites from 'internal/common/rewrites.mjs'

/**
 * @type {import('next').NextConfig}
 */
let nextConfig = {
    ...common,
    async redirects() {
        return redirects
    },
    async headers() {
        return commonHeaders
    },
    async rewrites() {
        return commonRewrites
    },
    webpack: (config) => {
        config.plugins.push(
            new CopyPlugin({
                patterns: [
                    { from: './node_modules/monaco-editor/min/vs', to: path.resolve('public/monaco-editor/vs') }
                ],
            })
        )
        return withWebpackConfig(config)
    }
}

export default nextConfig
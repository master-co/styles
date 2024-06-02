import redirects from './redirects.mjs'
import CopyPlugin from 'copy-webpack-plugin'
import path from 'path'
import withWebpackConfig from 'internal/common/with-webpack-config.mjs'
import defineNextConfig from 'internal/common/define-next-config.mjs'

let nextConfig = defineNextConfig(
    {
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
    },
    {
        redirects
    }
)

export default nextConfig
import redirects from './redirects.mjs'
import CopyPlugin from 'copy-webpack-plugin'
import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin'
import path from 'path'
import withWebpackConfig from 'internal/common/with-webpack-config.mjs'
import defineNextConfig from 'internal/common/define-next-config.mjs'

const nextConfig = await defineNextConfig(
    {
        webpack: (config, context) => {
            config.plugins.push(
                new CopyPlugin({
                    patterns: [
                        { from: './node_modules/monaco-editor/min/vs', to: path.resolve('public/monaco-editor/vs') }
                    ],
                }),
                new MonacoWebpackPlugin()
            )
            return withWebpackConfig(config, context)
        }
    },
    {
        redirects
    }
)

export default nextConfig
import { CSSExtractor } from '@master/css-extractor'
import type { Options } from '@master/css-extractor'
import type { Plugin } from 'vite'
import type { Pattern } from 'fast-glob'
import VirtualCSSModulePlugins from './virtual-css-module'
import VirtualCSSHMRPlugin from './virtual-css-hmr'

export default function masterCSSExtractorPlugin(
    customOptions?: Options | Pattern,
    cwd = process.cwd()
): Plugin[] {
    const extractor = new CSSExtractor(customOptions, cwd)
    extractor.on('init', (options: Options) => {
        options.include = []
    })
    return [
        {
            name: 'master-css-extractor',
            enforce: 'pre',
            apply(config, env) {
                if (!env.isSsrBuild) {
                    extractor.init()
                    return true
                } else {
                    return false
                }
            },
            async buildStart() {
                await extractor.prepare()
            },
            async transform(code, id) {
                const resolvedVirtualModuleId = extractor.resolvedVirtualModuleId
                if (id !== resolvedVirtualModuleId && !id.endsWith('.css')) {
                    await extractor.insert(id, code)
                }
            }
        },
        VirtualCSSHMRPlugin(extractor),
        ...VirtualCSSModulePlugins(extractor),
    ]
}
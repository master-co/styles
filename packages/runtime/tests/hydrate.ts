import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import RuntimeCSS from '../src'
import { parseCSS } from './cssom'

export default async function hydrate(currentFileURL: string) {
    const __filename = fileURLToPath(currentFileURL)
    const __dirname = dirname(__filename)
    const config = (await import(new URL('master.css', currentFileURL).href)).default
    const generatedCSS = readFileSync(resolve(__dirname, 'generated.css'), 'utf-8')
    const runtimeCSS = new RuntimeCSS(document, config)
    const generated = parseCSS(generatedCSS)
    runtimeCSS.hydrate(generated.cssRules as unknown as CSSRuleList)
    return {
        generated,
        runtimeCSS
    }
}
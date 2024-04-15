import { MasterCSS } from '@master/css'
import exploreConfig from '@master/css-explore-config'

let currentCSS
let currentConfig

export default function getCSS(config) {
    if (!currentCSS || currentConfig !== config) {
        currentCSS = new MasterCSS(typeof config === 'object' ? config : exploreConfig({ name: config, found: undefined }))
        currentConfig = config
    }
    return currentCSS
}
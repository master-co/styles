import { settings as cssLanguageServiceSettings, type Settings as CSSLanguageServiceSettings } from '@master/css-language-service'

const settings: Settings = {
    ...cssLanguageServiceSettings,
    workspaces: 'auto'
}

export default settings

export declare type Settings = CSSLanguageServiceSettings & {
    workspaces: string[] | 'auto'
}
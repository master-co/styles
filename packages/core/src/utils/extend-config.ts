import extend from '@techor/extend'
import type { AnimationDefinitions, Config } from '../types/config'

// todo: split resolveConfig into a function
export default function extendConfig(...configs: (Config | undefined)[]) {
    const formatConfig = (config: Config) => {
        const clonedConfig: Config = extend({}, config)
        const formatDeeply = (obj: Record<string, any>) => {
            for (const key in obj) {
                const value = obj[key]
                if (typeof value === 'object' && !Array.isArray(value)) {
                    formatDeeply(value)
                } else if (key && !key.startsWith('@')) {
                    obj[key] = { '': value }
                }
            }
        }
        if (clonedConfig.components) {
            formatDeeply(clonedConfig.components)
        }
        if (clonedConfig.at) {
            formatDeeply(clonedConfig.at)
        }
        if (clonedConfig.variables) {
            formatDeeply(clonedConfig.variables)
        }
        return clonedConfig
    }

    const formattedConfigs: Config[] = []
    for (const eachConfig of configs) {
        if (!eachConfig) continue
        (function getConfigsDeeply(config: Config) {
            if (config.extends?.length) {
                for (const eachExtend of config.extends) {
                    getConfigsDeeply('config' in eachExtend ? eachExtend.config : eachExtend)
                }
            }
            formattedConfigs.push(formatConfig(config))
        })(eachConfig)
    }

    let extendedConfig: Config = {
        animations: {},
        components: {},
        at: {},
        variables: {},
    }
    for (const currentFormattedConfig of formattedConfigs) {
        for (const key in currentFormattedConfig) {
            switch (key) {
                case 'animations':
                    if (currentFormattedConfig.animations) {
                        Object.assign(extendedConfig.animations as AnimationDefinitions, currentFormattedConfig.animations)
                    }
                    break
                default:
                    if (currentFormattedConfig[key as keyof Config]) {
                        extendedConfig = extend(extendedConfig, { [key]: currentFormattedConfig[key as keyof Config] })
                    }
            }
            // if (Object.prototype.hasOwnProperty.call(currentFormattedConfig.components, key)) {
            //     Object.assign(extendedConfig.components[key], currentFormattedConfig.components[key])
            // }
        }
    }

    return extendedConfig
}
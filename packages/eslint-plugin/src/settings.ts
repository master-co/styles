import { CLASS_ATTRIBUTES, CLASS_FUNCTIONS } from '@master/css'

const settings = {
    classAttributes: CLASS_ATTRIBUTES,
    classFunctions: CLASS_FUNCTIONS,
    ignoredKeys: ['compoundVariants', 'defaultVariants'],
    config: 'master.css'
}

export default settings

export interface Settings {
    calleeMatching: string
    classAttributes?: string[]
    classFunctions?: string[]
    ignoredKeys: string[]
    config: string | object
}
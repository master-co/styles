import { CLASS_ATTRIBUTES, CLASS_DECLARATIONS, CLASS_FUNCTIONS } from '@master/css'

const settings = {
    classAttributes: CLASS_ATTRIBUTES,
    classFunctions: CLASS_FUNCTIONS,
    classDeclarations: CLASS_DECLARATIONS,
    ignoredKeys: ['compoundVariants', 'defaultVariants'],
    config: 'master.css'
}

export default settings

export interface Settings {
    classAttributes?: string[]
    classFunctions?: string[]
    classDeclarations?: string[]
    ignoredKeys: string[]
    config: string | object
}
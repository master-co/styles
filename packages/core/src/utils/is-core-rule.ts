import syntaxes from '../config/syntaxes'

export default function isCoreRule(id: string) {
    return Object.hasOwnProperty.call(syntaxes, id)
}
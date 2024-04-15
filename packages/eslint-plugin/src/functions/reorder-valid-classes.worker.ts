import { reorderForReadableClasses } from '@master/css'
import { runAsWorker } from 'synckit'
import getCSS from './get-css'

export default function runReorderValidClasses(classNames: string[], config: string | object): string[] {
    const currentCSS = getCSS(config)
    return reorderForReadableClasses(classNames, currentCSS)
        .filter((eachOrderedClassName) => classNames.includes(eachOrderedClassName))
}

runAsWorker(runReorderValidClasses as any)
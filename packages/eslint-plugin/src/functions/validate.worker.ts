import { runAsWorker } from 'synckit'
import getCSS from './get-css'
import { validate } from '@master/css-validator'

export default function runValidate(className: string, config: string | object) {
    const currentCSS = getCSS(config)
    return validate(className, currentCSS)
}

runAsWorker(runValidate as any)
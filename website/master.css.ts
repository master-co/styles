import type { Config } from '@master/css'
import common from 'internal/master.css'
import base from './styles/base'
import btn from './styles/btn'

export default {
    extends: [
        base,
        btn
    ],
    ...common,
} as Config
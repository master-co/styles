import type { Config } from '@master/css'

export default {
    components: {
        box: 'flex font:1em bg:blue-50'
    },
    syntaxes: {
        foo: {
            match: /^foo:/,
            declare(value, unit) {
                return {
                    width: value + unit
                }
            }
        }
    }
} as Config
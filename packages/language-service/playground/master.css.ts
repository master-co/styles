import { Config, variables } from '@master/css'

export default {
    styles: {
        btn: 'inline-flex'
    },
    variables: {
        'font-family': {
            sans: ['Inter', ...variables['font-family'].sans],
        }
    }
} as Config
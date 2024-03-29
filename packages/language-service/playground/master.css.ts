// todo: Error: Could not dynamically require "@master/css". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.
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
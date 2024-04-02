// todo: Error: Could not dynamically require "@master/css". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.
import { Config } from '@master/css'

export default {
    styles: {
        btn: `inline-flex`
    },
    variables: {
        foo: 123
    }
} as Config

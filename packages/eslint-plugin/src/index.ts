import settings from './settings'
import legacy from './configs/legacy'
import base from './configs/base'
import recommended from './configs/recommended'
import plugin from './plugin'

export default {
    ...plugin,
    configs: {
        legacy,
        base,
        recommended
    },
    settings
}

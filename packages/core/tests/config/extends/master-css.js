import config1 from './master-1.css'
import config2 from './master-2.css'

/** @type {import('../../../src').Config} */
const config = {
    extends: [
        config1,
        config2
    ],
    variables:  {
        first: {
            '@dark': '$(black)'
        },
        second: {
            '@dark': '$(black)'
        },
        third: {
            '': '$(black)'
        },
        fourth: {
            '@dark': '$(black)'
        }
    }
}

export default config

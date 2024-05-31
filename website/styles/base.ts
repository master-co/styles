import type { Config } from '@master/css'

export default {
    styles: {
        yellow: 'bg:yellow fg:yellow-contrast outline:1|yellow-ring',
        touch: {
            yellow: 'bg:touch-yellow:hover'
        }
    },
    variables: {
        yellow: {
            ring: {
                '@light': '$(black)/.1',
                '@dark': '$(white)/.3'
            }
        },
        touch: {
            yellow: {
                '@light': '$(yellow-30)',
                '@dark': '$(yellow-40)'
            }
        },
        text: {
            'yellow-contrast': {
                '@light': '$(yellow-90)',
                '@dark': '$(yellow-95)'
            }
        }
    }
} as Config
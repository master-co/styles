import { Config } from '@master/css'

export default {
    variables: {
        primary: {
            '@light': '#000000',
            '@dark': '#ffffff'
        },
        content: {
            external: '" ↗"'
        }
    },
    styles: {
        btn: 'inline-flex bg:primary'
    }
} satisfies Config
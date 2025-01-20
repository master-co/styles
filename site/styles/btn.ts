import type { Config } from '@master/css'

export default {
    components: {
        btn: {
            '': 'center-content inline-flex font:semibold outline-offset:-1',
            'xs': 'font:12 h:6x px:2x r:4',
            'sm': 'font:12 h:8x px:3x r:6',
            'md': 'font:14 h:10x px:4x r:6',
            'lg': 'font:16 h:12x px:5x r:8',
            'xl': 'font:16 h:14x px:6x r:10',
            'rounded': {
                'xs': 'rounded font:12 h:6x px:3x',
                'sm': 'rounded font:12 h:8x px:4x',
                'md': 'rounded font:14 h:10x px:5x',
                'lg': 'rounded font:16 h:12x px:6x',
                'xl': 'rounded font:16 h:14x px:7x',
            }
        }
    }
} as Config
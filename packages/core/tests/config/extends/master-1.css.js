import config1 from './master-1-1.css'
import config2 from './master-1-2.css'

const config = {
    extends: [
        config1,
        config2,
    ],
    variables: {
        fourth: '$(first)',
        first: {
            '': '#111111',
            '@dark': '#222222',
            '@light': 'rgb(0, 0, 0)'
        },
        second: {
            '@dark': '#999999',
            '@light': 'rgb(0 0 0 / .5)'
        },
        third: {
            '@dark': '$(blue-50)',
            '2': {
                '@dark': '$(blue-60)'
            }
        }
    },
    components: {
        btn: 'font:14 h:40 text:center',
        blue: {
            btn: {
                '': 'btn bg:blue'
            }
        }
    }
}

module.exports = {
    config
}

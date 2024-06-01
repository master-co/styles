import colors from '~/website/data/colors'
import baseColors from '~/website/data/base-colors'

const syntaxes = [
    ['bg:`color`'],
    ...baseColors.map(color => `bg:${color}`),
    ...colors.map(color => `bg:${color}`),
]

export default syntaxes
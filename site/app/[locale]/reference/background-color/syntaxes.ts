import colors from 'internal/data/colors'
import baseColors from 'internal/data/base-colors'

const syntaxes = [
    ['bg:`color`'],
    ...baseColors.map(color => `bg:${color}`),
    ...colors.map(color => `bg:${color}`),
]

export default syntaxes
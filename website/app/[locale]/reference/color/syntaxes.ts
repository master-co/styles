import colors from 'internal/data/colors'
import textColors from 'internal/data/text-colors'

const syntaxes = [
    ['fg:`color`'],
    ...textColors.map(color => `fg:${color}`),
    ...colors.map(color => `fg:${color}`),
]

export default syntaxes
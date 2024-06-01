import colors from '~/website/data/colors'
import textColors from '~/website/data/text-colors'

const syntaxes = [
    ['fg:`color`'],
    ...textColors.map(color => `fg:${color}`),
    ...colors.map(color => `fg:${color}`),
]

export default syntaxes
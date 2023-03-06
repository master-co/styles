import { RuleConfig } from '../rule'

export const scrollSnapType: RuleConfig = {
    matches: '^scroll-snap:(?:(?:[xy]|block|inline|both)(?:\\|(?:proximity|mandatory))?|$values)(?!\\|)'
}
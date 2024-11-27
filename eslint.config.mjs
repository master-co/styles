import techor from 'eslint-config-techor'
import tseslint from 'typescript-eslint'

export default tseslint.config(
    techor.configs.base,
    techor.configs.stylistic
)
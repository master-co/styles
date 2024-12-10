import techor from 'eslint-config-techor'
import { includeIgnoreFile } from '@eslint/compat'
import { fileURLToPath } from 'node:url'

const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url))

export default [
    includeIgnoreFile(gitignorePath),
    techor.configs.base,
    techor.configs.stylistic
]
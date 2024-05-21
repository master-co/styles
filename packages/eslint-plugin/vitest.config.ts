import { UserWorkspaceConfig, defineConfig } from 'vitest/config'
import config from '../../shared/vitest.config'
import extend from '@techor/extend'
import { } from 'vitest'

export default defineConfig(extend(config, {
    test: {
        setupFiles: ['./tests/setup.ts']
    }
} as UserWorkspaceConfig))
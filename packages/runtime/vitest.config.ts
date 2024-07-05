import { defineConfig } from 'vitest/config'
import config from '../../shared/vitest.config'
import extend from '@techor/extend'
import type { UserConfig } from 'vitest'

export default defineConfig(
    extend(config, {
        test: {
            environment: 'jsdom',
            hookTimeout: 30000
        }
    } as UserConfig)
)
import { defineConfig } from 'vitest/config'
import config from '../../shared/vitest.config'
import extend from '@techor/extend'
import { UserConfig } from 'vitest'

export default defineConfig(extend(config, {
    environment: 'jsdom'
} as UserConfig))
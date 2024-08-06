import tsconfigPaths from 'vite-tsconfig-paths'
import type { UserConfig } from 'vitest/config'

export default {
    test: {
        include: [
            'tests/**/*.{test,spec}.?(c|m)[jt]s?(x)',
            'tests/**/test.?(c|m)[jt]s?(x)'
        ]
    },
    testTimeout: 15000,
    plugins: [
        tsconfigPaths({
            ignoreConfigErrors: true
        })
    ]
} as UserConfig
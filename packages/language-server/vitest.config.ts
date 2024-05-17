import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
    test: {
        testTimeout: 15000,
        include: [
            '**/*.{test,spec}.?(c|m)[jt]s?(x)',
            '**/test.?(c|m)[jt]s?(x)'
        ]
    },
    plugins: [tsconfigPaths({
        ignoreConfigErrors: true
    })]
})
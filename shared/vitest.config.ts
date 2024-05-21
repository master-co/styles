import tsconfigPaths from 'vite-tsconfig-paths'

export default {
    test: {
        include: [
            'tests/**/*.{test,spec}.?(c|m)[jt]s?(x)',
            'tests/**/test.?(c|m)[jt]s?(x)'
        ]
    },
    plugins: [
        tsconfigPaths({
            ignoreConfigErrors: true
        })
    ]
}
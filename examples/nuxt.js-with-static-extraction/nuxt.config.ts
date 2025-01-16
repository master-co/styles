import masterCSSExtractor from '@master/css-extractor.vite'

export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    vite: {
        plugins: [
            masterCSSExtractor()
        ]
    }
})

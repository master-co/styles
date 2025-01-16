import { defineConfig } from 'vite'
import masterCSSExtractor from '@master/css-extractor.vite'

export default defineConfig({
    plugins: [
        masterCSSExtractor()
    ]
})
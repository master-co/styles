import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import masterCSSExtractor from '@master/css-extractor.vite'

export default defineConfig({
    plugins: [
        sveltekit(),
        masterCSSExtractor({ sources: ['./src/app.html'] })
    ]
})

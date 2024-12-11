export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    app: {
        head: {
            script: [
                { innerHTML: 'document.documentElement.style.display = "none"' }
            ]
        }
    }
})
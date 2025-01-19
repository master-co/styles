import '../../src/global.min'

window.addEventListener('DOMContentLoaded', () => {
    document.querySelector('h1')?.classList.add('@fade|1s', '@fade|2s')
    setTimeout(() => {
        document.querySelector('h1')?.classList.remove('@fade|1s', '@fade|2s')
    })
})
export default function prerender({ output }: { output: string }) {
    const style = document.createElement('style')
    style.id = 'master'
    style.textContent = output
    document.head.appendChild(style)
}
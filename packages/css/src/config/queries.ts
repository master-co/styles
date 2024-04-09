import screenSizes from '../tokens/screen-sizes'

const queries = {
    all: 'media all',
    print: 'media print',
    screen: 'media screen',
    speech: 'media speech',
    landscape: 'media (orientation:landscape)',
    portrait: 'media (orientation:portrait)',
    motion: 'media (prefers-reduced-motion:no-preference)',
    'reduced-motion': 'media (prefers-reduced-motion:reduce)',
    ...screenSizes,
}

export default queries